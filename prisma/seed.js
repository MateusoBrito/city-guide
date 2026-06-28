const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const ouroPreto = await prisma.cidade.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: "Ouro Preto",
      estado: "MG",
      pais: "Brasil",
    },
  });

  const saoJoaoDelRei = await prisma.cidade.upsert({
    where: { id: 2 },
    update: {
      nome: "Sao Joao del-Rei",
      estado: "MG",
      pais: "Brasil",
    },
    create: {
      id: 2,
      nome: "Sao Joao del-Rei",
      estado: "MG",
      pais: "Brasil",
    },
  });

  const listaUsuarios = [
    {
      email: "estermariasouza2005@gmail.com",
      nome: "Ester",
      tipo: "admin",
      cidadeId: saoJoaoDelRei.id,
    },
    {
      email: "mateusdeoliveirabritoo@gmail.com",
      nome: "Mateus",
      tipo: "usuario",
      cidadeId: saoJoaoDelRei.id,
    },
    {
      email: "estermariasouza2005@aluno.ufsj.edu.br",
      nome: "Ester",
      tipo: "admin",
      cidadeId: saoJoaoDelRei.id,
    },
    {
      email: "carlos.visitante@yahoo.com",
      nome: "Carlos Visitante",
      tipo: "visitante",
      // Sem cidadeId para testar usuários com perfil incompleto
    },
  ];

  for (const user of listaUsuarios) {
    await prisma.usuario.upsert({
      where: { email: user.email }, // Busca pelo email, que é o @id
      update: {}, // Se já existir, não faz nada
      create: user, // Se não existir, cria
    });
  }

  console.log("Usuários de teste inseridos com sucesso!");

  const estabelecimentos = [
    {
      id: 1,
      nome: "Cafe Imperial",
      categoria: "Cafeteria",
      descricao: "Cafe aconchegante no centro historico.",
      imagemUrl:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop",
      cep: "35400-000",
      rua: "Rua Direita",
      bairro: "Centro",
      numero: "120",
      telefone: "(31) 99999-1001",
      mediaNota: 4.7,
      numAvaliacoes: 42,
      aprovado: true,
      cidadeId: ouroPreto.id,
    },
    {
      id: 2,
      nome: "Restaurante Vila Mineira",
      categoria: "Restaurante",
      descricao: "Comida mineira tradicional servida no fogao a lenha.",
      imagemUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
      cep: "35400-000",
      rua: "Rua Sao Jose",
      bairro: "Centro",
      numero: "85",
      telefone: "(31) 99999-1002",
      mediaNota: 4.5,
      numAvaliacoes: 35,
      aprovado: true,
      cidadeId: ouroPreto.id,
    },
    {
      id: 3,
      nome: "Pousada das Artes",
      categoria: "Hotel",
      descricao: "Hospedagem charmosa perto das principais igrejas.",
      imagemUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
      cep: "35400-000",
      rua: "Rua Conde de Bobadela",
      bairro: "Centro",
      numero: "210",
      telefone: "(31) 99999-1003",
      mediaNota: 4.3,
      numAvaliacoes: 28,
      aprovado: true,
      cidadeId: ouroPreto.id,
    },
    {
      id: 4,
      nome: "Bar do Largo",
      categoria: "Bar",
      descricao: "Petiscos, bebidas e musica ao vivo nos fins de semana.",
      imagemUrl:
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop",
      cep: "35400-000",
      rua: "Rua das Flores",
      bairro: "Antonio Dias",
      numero: "44",
      telefone: "(31) 99999-1004",
      mediaNota: 4.1,
      numAvaliacoes: 19,
      aprovado: true,
      cidadeId: ouroPreto.id,
    },
    {
      id: 5,
      nome: "Bistro Solar da Ponte",
      categoria: "Turismo",
      descricao: "Ponto turistico com visitas guiadas pelo centro historico.",
      imagemUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
      cep: "36300-000",
      rua: "Rua Ministro Gabriel Passos",
      bairro: "Centro",
      numero: "58",
      telefone: "(32) 99999-2001",
      mediaNota: 4.6,
      numAvaliacoes: 31,
      aprovado: true,
      cidadeId: saoJoaoDelRei.id,
    },
    {
      id: 6,
      nome: "Cafe da Serra",
      categoria: "Padaria",
      descricao: "Padaria charmosa com doces caseiros e vista para a serra.",
      imagemUrl:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
      cep: "36300-000",
      rua: "Rua Getulio Vargas",
      bairro: "Centro",
      numero: "142",
      telefone: "(32) 99999-2002",
      mediaNota: 4.4,
      numAvaliacoes: 24,
      aprovado: true,
      cidadeId: saoJoaoDelRei.id,
    },
  ];

  for (const estabelecimento of estabelecimentos) {
    const { id, ...dados } = estabelecimento;

    await prisma.estabelecimento.upsert({
      where: { id },
      update: dados,
      create: estabelecimento,
    });
  }

  console.log("Banco populado com estabelecimentos de teste.");
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
