// Editar informações do usuário
export async function PUT(request, { params }) {
  const { id } = params; // Obtém o ID do usuário dos parâmetros da URL
  const { name, email, icone, cargo, setor } = await request.json();
  await connectMongo();

  // Extrai o token do cabeçalho
  const token = request.headers.get("Authorization")?.split(" ")[1]; // Assume formato "Bearer <token>"

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token não fornecido" },
      { status: 401 }
    );
  }

  try {
    // Verifica se o usuário existe
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Atualiza os campos do usuário
    user.name = name || user.name;
    user.email = email || user.email;
    user.icone = icone || user.icone;
    user.cargo = cargo || user.cargo;
    user.setor = setor || user.setor;

    const updatedUser = await user.save();

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}
