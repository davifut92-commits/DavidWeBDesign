// Edite apenas o texto dentro das aspas. Não precisa mexer em mais nenhum arquivo.
window.CONFIG = {
  name: "David Andrade Barbosa",
  lineOne: "David",
  lineTwo: "Andrade Barbosa",
  hello: "Olá, eu sou",
  role: "Web Designer · Desenvolvedor de Sistemas Web",
  status: "Votorantim, SP · Aberto a projetos",

  nav: { home: "Início", about: "Sobre", work: "Trabalho", skills: "Skills", resume: "Currículo", contact: "Contato" },

  about: {
    eyebrow: "01 — Sobre",
    title: "Design bonito por fora, sistema sólido por dentro.",
    text: "Formado em Web Design e especialista em desenvolvimento de sistemas e sites modernos. Estou começando minha trajetória profissional e crio sites de avaliação gratuitos para mostrar meu trabalho. Do visual à lógica, busco interfaces claras, rápidas e fáceis de usar.",
    stats: [
      { value: "4", label: "Projetos no portfólio" },
      { value: "Web + Sistemas", label: "Design e desenvolvimento" },
      { value: "Grátis", label: "Sites de avaliação" }
    ]
  },

  work: {
    eyebrow: "02 — Trabalho",
    title: "Projetos que eu fiz",
    projects: [
      {
        title: "Solda Certa",
        tags: ["Orçamento", "Agendamento", "Mapas"],
        desc: "Site para serviços de solda e estruturas metálicas, com orçamento, agendamento, galeria e depoimentos.",
        url: "https://solda-certa.lovable.app"
      },
      {
        title: "Franco Barbershop",
        tags: ["HTML", "CSS", "JavaScript"],
        desc: "Site de barbearia com galeria de cortes, vídeos e agendamento por WhatsApp.",
        url: ""
      },
      {
        title: "Laura Fernandes",
        tags: ["React", "TypeScript", "Tailwind"],
        desc: "Site de manicure com vídeo de abertura, carrossel de serviços e agendamento por WhatsApp.",
        url: "https://laurafernandes.lovable.app"
      },
      {
        title: "Letícia Barreto",
        tags: ["Fisioterapia", "WhatsApp", "Responsivo"],
        desc: "Site de fisioterapia domiciliar com serviços, depoimentos e contato direto.",
        url: "https://letyciabarretofisioterapeuta.lovable.app"
      }
    ],
    visit: "Ver site ↗",
    soon: "Link em breve"
  },

  skills: {
    eyebrow: "03 — Skills",
    title: "O que eu uso",
    list: [
      "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js",
      "Tailwind CSS", "Web design responsivo", "UI/UX", "WhatsApp",
      "Supabase", "Netlify"
    ]
  },

  resume: {
    eyebrow: "04 — Currículo",
    title: "Experiência e formação",
    experienceTitle: "Experiência",
    educationTitle: "Formação",
    experience: [
      {
        role: "Web Designer",
        org: "Projetos próprios e sites de avaliação",
        period: "Atual",
        text: "Criação de sites e sistemas web para pequenos negócios: manicure, fisioterapia, barbearia e serviços de solda."
      }
    ],
    education: [
      {
        role: "Web Designer",
        org: "Eurodata Interativa (atual Unoprime)",
        period: "",
        text: "Curso de capacitação profissional."
      }
    ],
    // Para baixar um PDF: coloque o arquivo em site/media/resume.pdf e escreva "media/resume.pdf" aqui.
    file: "",
    buttonDownload: "Baixar currículo",
    buttonEmail: "Pedir currículo por e-mail"
  },

  contact: {
    eyebrow: "05 — Contato",
    title: "Vamos conversar?",
    text: "Quer um site ou um sistema web? Me chame.",
    email: "david.andrade.barbosa92@gmail.com",
    links: [
      { label: "TikTok @reidosite01", url: "https://www.tiktok.com/@reidosite01" }
    ],
    city: "Votorantim, São Paulo"
  },

  ui: { hint: "Role para começar", loading: "Carregando" }
};
