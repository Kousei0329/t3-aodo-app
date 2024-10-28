import { z } from "zod";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./api/root";

//APIの型定義であるAppRouterの出力の方を推論するためのヘルパータイプRouterOutputを定義
type RouterOutput = inferRouterOutputs<AppRouter>;
//Todoを全件取得するルーターの出力の型を定義
type allTodosOutput = RouterOutput["todo"]["all"];
//todo⇒server/api/root.tsで定義したcreateTRPCRouterで指定したキー
//todo⇒todoRouter⇒todo.tsに存在するプロシージャ全体(allとかdeleteとか)
//all⇒server/api/routers/todo.tsで定義したプロシージャ(関数)の名前
//⇒つまり、RouterOutput["todo"]["all"];はtodoRouter内のallプロシージャの返り値
/*type allTodosOutput = {
    id: string;
    text: string;
    isCompleted: boolean;
}[]
 */
export type Todo = allTodosOutput[number];
//allTodosOutputの1要素をTodoの型としてエクスポート
/*
type todo ={
    id: string;
    text: string;
    isCOmpleted: boolean;
}
*/

export const createInput = z
    .string()
    .min(1, "todo must be at least 1 better")
    .max(50, "todo must be 50 letters or less");

export const updateInput = z.object({
        id: z.string(),
        text: z
            .string()
            .min(1, "todo must be at least 1 letter")
            .max(50, "todo must be 50 letters or less"),
})

export const toggleInput = z.object({
    id: z.string(),
    is_completed: z.boolean(),
})