#!/usr/bin/env bash
# Junta clips/clip1.mp4 ... clip6.mp4 em UM filme continuo e gera as versoes web.
# Uso: bash build_film.sh
set -euo pipefail
cd "$(dirname "$0")"

FADE=0.25
FPS=24
mkdir -p build site/media

# --- Marca d'agua do Veo -----------------------------------------------------
# Os clipes deste projeto NAO tem marca d'agua (canto inferior direito medido:
# so fundo preto). Se os seus clipes tiverem, descomente e ajuste x:y:w:h:
# DELOGO=",delogo=x=1130:y=680:w=140:h=30"
DELOGO=""

# --- Duracoes ----------------------------------------------------------------
D=()
for i in 1 2 3 4 5 6; do
  D[$i]=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "clips/clip$i.mp4")
done

# --- Filtro: normaliza + xfade em cadeia --------------------------------------
FC=""
for i in 1 2 3 4 5 6; do
  FC+="[$((i-1)):v]fps=$FPS,scale=1280:720:flags=lanczos,setsar=1,format=yuv420p,setpts=PTS-STARTPTS[v$i];"
done

OFFSET=$(awk -v d="${D[1]}" -v f=$FADE 'BEGIN{printf "%.3f", d-f}')
FC+="[v1][v2]xfade=transition=fade:duration=$FADE:offset=$OFFSET[x2];"
ACC=$(awk -v d="${D[1]}" -v e="${D[2]}" -v f=$FADE 'BEGIN{printf "%.3f", d+e-f}')
for i in 3 4 5 6; do
  OFFSET=$(awk -v a="$ACC" -v f=$FADE 'BEGIN{printf "%.3f", a-f}')
  FC+="[x$((i-1))][v$i]xfade=transition=fade:duration=$FADE:offset=$OFFSET[x$i];"
  ACC=$(awk -v a="$ACC" -v d="${D[$i]}" -v f=$FADE 'BEGIN{printf "%.3f", a+d-f}')
done
# Cinzas escuros -> preto puro (ponto preto ~0.045)
FC+="[x6]colorlevels=rimin=0.045:gimin=0.045:bimin=0.045${DELOGO}[out]"

ffmpeg -v error -y \
  -i clips/clip1.mp4 -i clips/clip2.mp4 -i clips/clip3.mp4 \
  -i clips/clip4.mp4 -i clips/clip5.mp4 -i clips/clip6.mp4 \
  -filter_complex "$FC" -map "[out]" -an \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -r $FPS \
  build/film_master.mp4

# --- Versoes web: todo quadro e keyframe (-g 1) -------------------------------
ffmpeg -v error -y -i build/film_master.mp4 -an \
  -vf "scale=1280:-2" -c:v libx264 -preset slow -crf 27 -g 1 -pix_fmt yuv420p \
  -movflags +faststart site/media/film.mp4

ffmpeg -v error -y -i build/film_master.mp4 -an \
  -vf "scale=854:-2" -c:v libx264 -preset slow -crf 28 -g 1 -pix_fmt yuv420p \
  -movflags +faststart site/media/film_mobile.mp4

ffmpeg -v error -y -i build/film_master.mp4 -frames:v 1 -q:v 3 site/media/poster.jpg

echo "Duracao: $(ffprobe -v error -show_entries format=duration -of csv=p=0 build/film_master.mp4) s"
ls -lh site/media/film.mp4 site/media/film_mobile.mp4 site/media/poster.jpg
