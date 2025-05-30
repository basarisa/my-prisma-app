import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function PUT(req: Request, context: any) {
  try {
    const id = context.params.id;
    const { name } = await req.json();

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    return Response.json(category);
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update category" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const id = context.params.id;

    const deletedCategory = await prisma.category.delete({
      where: { id: Number(id) },
    });

    return Response.json(deletedCategory);
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete category" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
