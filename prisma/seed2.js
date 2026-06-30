const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Função auxiliar para gerar datas de nascimento baseadas na idade desejada
function gerarDataNascimento(idade) {
  const anoAtual = 2026; // Alinhado com o contexto do projeto
  const anoNascimento = anoAtual - idade;
  // Define uma data fixa no ano (ex: 15 de Junho) para simplificar
  return new Date(`${anoNascimento}-06-15T00:00:00.000Z`);
}

async function main() {
  // 1. Criação/Atualização das Cidades
  const ouroPreto = await prisma.cidade.upsert({
    where: { id: 1 },
    update: { latitude: -20.3856, longitude: -43.5035 },
    create: { id: 1, nome: "Ouro Preto", estado: "MG", pais: "Brasil", latitude: -20.3856, longitude: -43.5035 },
  });

  const saoJoaoDelRei = await prisma.cidade.upsert({
    where: { id: 2 },
    update: { nome: "Sao Joao del-Rei", estado: "MG", pais: "Brasil", latitude: -21.1356, longitude: -44.2612 },
    create: { id: 2, nome: "Sao Joao del-Rei", estado: "MG", pais: "Brasil", latitude: -21.1356, longitude: -44.2612 },
  });

  // 2. Usuários Administrativos e Padrões Fixos
  const usuariosFixos = [
    { email: "estermariasouza2005@gmail.com", nome: "Ester Admin", tipo: "admin", cidadeId: saoJoaoDelRei.id, dataNascimento: gerarDataNascimento(21) },
    { email: "mateusdeoliveirabritoo@gmail.com", nome: "Mateus", tipo: "usuario", cidadeId: saoJoaoDelRei.id, dataNascimento: gerarDataNascimento(22) },
    { email: "carlos.visitante@yahoo.com", nome: "Carlos", tipo: "usuario", cidadeId: ouroPreto.id, dataNascimento: gerarDataNascimento(34) },
  ];

  for (const user of usuariosFixos) {
    await prisma.usuario.upsert({
      where: { email: user.email },
      update: { dataNascimento: user.dataNascimento },
      create: user,
    });
  }

  // 3. Inserção de Estabelecimentos Base
  const estabelecimentos = [
    { id: 1, nome: "Cafe Imperial", categoria: "Cafeteria", descricao: "Cafe aconchegante no centro historico.", cep: "35400-000", rua: "Rua Direita", bairro: "Centro", numero: "120", telefone: "(31) 99999-1001", mediaNota: 4.7, numAvaliacoes: 42, aprovado: true, cidadeId: ouroPreto.id, latitude: -20.3848, longitude: -43.5028 },
    { id: 2, nome: "Restaurante Vila Mineira", categoria: "Restaurante", descricao: "Comida mineira tradicional servida no fogao a lenha.", cep: "35400-000", rua: "Rua Sao Jose", bairro: "Centro", numero: "85", telefone: "(31) 99999-1002", mediaNota: 4.5, numAvaliacoes: 35, aprovado: true, cidadeId: ouroPreto.id, latitude: -20.3862, longitude: -43.5041 },
    { id: 3, nome: "Pousada das Artes", categoria: "Hotel", descricao: "Hospedagem charmosa perto das principais igrejas.", cep: "35400-000", rua: "Rua Conde de Bobadela", bairro: "Centro", numero: "210", telefone: "(31) 99999-1003", mediaNota: 4.3, numAvaliacoes: 28, aprovado: true, cidadeId: ouroPreto.id, latitude: -20.3839, longitude: -43.5055 },
    { id: 4, nome: "Bar do Largo", categoria: "Bar", descricao: "Petiscos, bebidas e musica ao vivo nos fins de semana.", cep: "35400-000", rua: "Rua das Flores", bairro: "Antonio Dias", numero: "44", telefone: "(31) 99999-1004", mediaNota: 4.1, numAvaliacoes: 19, aprovado: true, cidadeId: ouroPreto.id, latitude: -20.3881, longitude: -43.4998 },
    { id: 5, nome: "Bistro Solar da Ponte", categoria: "Restaurante", descricao: "Ponto turistico com visitas guiadas pelo centro historico.", cep: "36300-000", rua: "Rua Ministro Gabriel Passos", bairro: "Centro", numero: "58", telefone: "(32) 99999-2001", mediaNota: 4.6, numAvaliacoes: 31, aprovado: true, cidadeId: saoJoaoDelRei.id, latitude: -21.1348, longitude: -44.2601 },
    { id: 6, nome: "Cafe da Serra", categoria: "Padaria", descricao: "Padaria charmosa com doces caseiros e vista para a serra.", cep: "36300-000", rua: "Rua Getulio Vargas", bairro: "Centro", numero: "142", telefone: "(32) 99999-2002", mediaNota: 4.4, numAvaliacoes: 24, aprovado: true, cidadeId: saoJoaoDelRei.id, latitude: -21.1371, longitude: -44.2629 },
  ];

  for (const est of estabelecimentos) {
    const { id, ...dados } = est;
    await prisma.estabelecimento.upsert({
      where: { id },
      update: dados,
      create: est,
    });
  }

  // 4. 🚀 GERADOR AUTOMÁTICO DE ENGAGEMENT (Usuários + Avaliações)
  console.log("Iniciando geração de dados volumétricos para testes...");

  const nomesFicticios = ["Ana", "Bruno", "Camila", "Diego", "Amanda", "Gabriel", "Julia", "Lucas", "Mariana", "Pedro", "Larissa", "Rodrigo"];
  const sobrenomesFicticios = ["Silva", "Santos", "Oliveira", "Souza", "Pereira", "Almeida", "Ribeiro", "Costa"];
  
  const idadesParaTestar = [19, 21, 24, 25, 28, 30, 32, 35, 40, 45, 52, 58, 61];
  const comentariosExemplo = [
    "Lugar sensacional, excelente atendimento!",
    "Muito bom, recomendo a visita.",
    "Achei um pouco caro pelo que entrega.",
    "Ambiente agradável e aconchegante.",
    "Instalações limpas e equipe atenciosa.",
    "Comida saborosa e ambiente bem localizado."
  ];

  for (let i = 1; i <= 30; i++) {
    const nome = nomesFicticios[i % nomesFicticios.length];
    const sobrenome = sobrenomesFicticios[i % sobrenomesFicticios.length];
    const email = `usuario.teste${i}@gtest.com`;
    
    const cidadeId = i % 2 === 0 ? saoJoaoDelRei.id : ouroPreto.id;
    const idade = idadesParaTestar[i % idadesParaTestar.length];

    await prisma.usuario.upsert({
      where: { email },
      update: {},
      create: {
        email,
        nome: `${nome} ${sobrenome}`,
        tipo: "usuario",
        cidadeId,
        dataNascimento: gerarDataNascimento(idade),
      },
    });

    const qtdAvaliacoes = (i % 3) + 1; 
    for (let j = 0; j < qtdAvaliacoes; j++) {
      const estId = ((i + j) % 6) + 1;
      
      let nota = 4;
      if (idade <= 25 && estId === 1) nota = 5; 
      if (idade > 50 && estId === 3) nota = 5;  

      const comentario = comentariosExemplo[(i + j) % comentariosExemplo.length];

      await prisma.avaliacao.upsert({
        where: {
          usuarioEmail_estabelecimentoId: {
            usuarioEmail: email,
            estabelecimentoId: estId,
          },
        },
        update: {},
        create: {
          usuarioEmail: email,
          estabelecimentoId: estId,
          nota,
          comentario,
          aprovada: true,
        },
      });
    }
  }

  console.log("População de dados concluída com sucesso! 30 usuários e ~60 avaliações cruzadas inseridas.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });