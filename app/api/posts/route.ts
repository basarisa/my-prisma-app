import { type NextRequest } from "next/server";
import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "desc";

  //console.log({ search, category, sort }); // Debugging output

  const whereCondition = category
    ? {
        category: {
          is: {
            name: category,
          },
        },
        title: {
          contains: search,
          mode: "insensitive",
        },
      }
    : {
        title: {
          contains: search,
          mode: "insensitive",
        },
      };

  const posts = await prisma.post.findMany({
    where: whereCondition as any, // Use 'as any' to avoid type issues with Prisma
    orderBy: {
      createdAt: sort, // Sort by createdAt field
    } as any,
    include: {
      category: true, // Include category information
    },
  });
  // You can add filtering and sorting logic here based on search, category, and sort parameters

  return Response.json(posts);
}

export async function POST(req: Request) {
  try {
    const { title, content, categoryId } = await req.json();
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        categoryId: Number(categoryId), // Assuming category is a field in your Post model
      },
    });
    return Response.json(newPost);
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    });
  }
}
