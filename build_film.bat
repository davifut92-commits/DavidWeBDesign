@echo off
REM Versao Windows de build_film.sh (requer ffmpeg no PATH: winget install ffmpeg)
REM Os clipes deste projeto nao tem marca d'agua do Veo; nao ha delogo.
REM Para a duracao de cada clipe usamos 7,7,6,6,6,6 s (ajuste se os seus forem diferentes).
cd /d "%~dp0"
if not exist build mkdir build
if not exist site\media mkdir site\media

ffmpeg -y -i clips\clip1.mp4 -i clips\clip2.mp4 -i clips\clip3.mp4 -i clips\clip4.mp4 -i clips\clip5.mp4 -i clips\clip6.mp4 ^
 -filter_complex "[0:v]fps=24,scale=1280:720,setsar=1,format=yuv420p,setpts=PTS-STARTPTS[v1];[1:v]fps=24,scale=1280:720,setsar=1,format=yuv420p,setpts=PTS-STARTPTS[v2];[2:v]fps=24,scale=1280:720,setsar=1,format=yuv420p,setpts=PTS-STARTPTS[v3];[3:v]fps=24,scale=1280:720,setsar=1,format=yuv420p,setpts=PTS-STARTPTS[v4];[4:v]fps=24,scale=1280:720,setsar=1,format=yuv420p,setpts=PTS-STARTPTS[v5];[5:v]fps=24,scale=1280:720,setsar=1,format=yuv420p,setpts=PTS-STARTPTS[v6];[v1][v2]xfade=transition=fade:duration=0.25:offset=6.75[x2];[x2][v3]xfade=transition=fade:duration=0.25:offset=13.5[x3];[x3][v4]xfade=transition=fade:duration=0.25:offset=19.25[x4];[x4][v5]xfade=transition=fade:duration=0.25:offset=25.0[x5];[x5][v6]xfade=transition=fade:duration=0.25:offset=30.75[x6];[x6]colorlevels=rimin=0.045:gimin=0.045:bimin=0.045[out]" ^
 -map "[out]" -an -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -r 24 build\film_master.mp4

ffmpeg -y -i build\film_master.mp4 -an -vf "scale=1280:-2" -c:v libx264 -preset slow -crf 27 -g 1 -pix_fmt yuv420p -movflags +faststart site\media\film.mp4
ffmpeg -y -i build\film_master.mp4 -an -vf "scale=854:-2" -c:v libx264 -preset slow -crf 28 -g 1 -pix_fmt yuv420p -movflags +faststart site\media\film_mobile.mp4
ffmpeg -y -i build\film_master.mp4 -frames:v 1 -q:v 3 site\media\poster.jpg
echo Pronto.
