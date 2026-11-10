# Portfólio de David Andrade Barbosa

Site de uma página só: o vídeo (6 clipes unidos em 1 filme de 36,75 s) avança e volta conforme você rola.

## Ver no computador
Não abra o index.html com dois cliques (o navegador bloqueia o vídeo). Use um servidor local:

    npx serve site
    # ou, sem Node:
    python3 -m http.server 8000 --directory site

Depois abra o endereço que aparecer (por exemplo http://localhost:3000).

## Mudar textos, projetos, e-mail
Abra `site/config.js` e edite só o texto entre aspas.
- Link do Franco Barbershop: preencha `url` do projeto quando tiver o endereço.
- Currículo em PDF: coloque em `site/media/resume.pdf` e escreva `file: "media/resume.pdf"`.

## Publicar (grátis)
Arraste a pasta `site` para https://app.netlify.com/drop

## Refazer o filme
Se trocar algum clipe em `clips/clip1.mp4 ... clip6.mp4`, rode `bash build_film.sh`
(Windows: `build_film.bat`). Requer ffmpeg. Ele gera `site/media/film.mp4`,
`film_mobile.mp4` e `poster.jpg`.
Se mudar a duração dos clipes, ajuste os tempos no topo de `site/app.js` (SEGS, WIN, SHIFT).

## Estrutura
    site/            o site (index.html, style.css, app.js, config.js, media/)
    clips/           os 6 clipes originais, na ordem
    build_film.sh    junta os clipes (fade de 0,25 s), escurece o preto, gera as versões web
