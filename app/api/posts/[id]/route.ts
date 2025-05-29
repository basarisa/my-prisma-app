import { PrismaClient } from "../../../generated/prisma";
const prisma = new PrismaClient(); // สร้าง instance ของ PrismaClient เพื่อใช้งานกับฐานข้อมูล

// ------------------- GET by Id  (get ข้อมูลตาม id เพืื่อที่จะแก้ไขข้อมูล)-------------------
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // context.params จะเป็น Promise ที่ต้องรอให้เสร็จก่อน
) {
  try {
    const { id } = await context.params; // รอให้ params เสร็จก่อน แล้วดึง id ออกมา
    const postId = Number(id);
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { category: true },
    }); // ค้นหาโพสต์ตาม id ที่ได้รับมา
    return Response.json(post); // ส่งโพสต์ที่ค้นหากลับไปให้ client

    // ถ้าไม่พบโพสต์ จะส่งข้อความ "Post not found" กลับไป
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch post", detail: String(error) },
      { status: 500 }
    );
  }
}

// ------------------- PUT by ID  (แก้ไขข้อมูลตาม ID )-------------------
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { title, content, categoryId } = await request.json(); // รับข้อมูลใหม่จากฝั่ง client
    const { id } = await context.params; // รอให้ params เสร็จก่อน แล้วดึง id ออกมา
    const postId = Number(id); // แปลง id เป็นตัวเลข
    const updatedPost = await prisma.post.update({
      // อัปเดตโพสต์ในฐานข้อมูล
      where: {
        id: postId,
      },
      data: {
        title,
        content,
        categoryId: Number(categoryId), // Assuming category is a field in your Post model
      },
    });
    return Response.json(updatedPost); // ส่งโพสต์ที่อัปเดตกลับไปให้ client
  } catch (error) {
    return Response.json(
      { error: "Failed to update post", detail: String(error) },
      { status: 500 }
    );
  }
}

// ------------------- DELETE By Id -------------------//
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // รอให้ params เสร็จก่อน แล้วดึง id ออกมา
    const postId = Number(id);
    const deletedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return Response.json(deletedPost);
  } catch (error) {
    return Response.json(
      { error: "Failed to delete post", detail: String(error) },
      { status: 500 }
    );
  }
}
