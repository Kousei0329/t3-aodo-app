import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createInput, toggleInput, updateInput } from "~/server/types";
import { TRPCError } from "@trpc/server";
//すべてのctx.prismaをctx.dbに変更
//多分/src/server/auth.tsでimport { db } from "~/server/db"にしてることが原因?

export const todoRouter = createTRPCRouter({
//以下、動作の定義を実行
//すべてtodo.?で実行される
 all: protectedProcedure.query(async ({ ctx }) => {
   const todos = await ctx.db.todo.findMany({
     where: {
       userId: ctx.session.user.id,
     },
     orderBy: {
       createdAt: "desc",
     },
   });
   return todos.map(({ id, text, isCompleted }) => ({
     id,
     text,
     isCompleted,
   }));
 }),
 create: protectedProcedure.input(createInput).mutation(({ ctx, input }) => {
    //楽観的更新のエラー確認
    /*throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "failed to create todo",
    });*/
    return ctx.db.todo.create({
     data: {
       text: input,
       user: {
         connect: {
           id: ctx.session.user.id,
         },
       },
     },
   });
 }),
 toggle: protectedProcedure.input(toggleInput).mutation(({ ctx, input }) => {
  //完了/未完の楽観的更新確認
  /*throw new TRPCError({
    code:"INTERNAL_SERVER_ERROR",
    message:"failed to create todo",
  })*/
  const { id, is_completed } = input;
   return ctx.db.todo.update({
     where: {
       id,
     },
     data: {
       isCompleted: is_completed,
     },
   });
 }),
 update: protectedProcedure.input(updateInput).mutation(({ ctx, input }) => {
  //編集エラー確認
  /*throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message:"failed to update todo"
  })*/ 
  const { id, text } = input;
   return ctx.db.todo.update({
     where: {
       id,
     },
     data: {
       text,
     },
   });
 }),
 delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
  //削除エラー確認
  /*throw new TRPCError({
    code:"INTERNAL_SERVER_ERROR",
    message: "failed to delete todo"
  });*/
  return ctx.db.todo.delete({
     where: {
       id: input,
     },
   });
 }),
});