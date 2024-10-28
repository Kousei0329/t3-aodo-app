import { useState } from "react";
import toast from "react-hot-toast";
import { createInput } from "~/server/types";
//apiの定義を渡す
import type {Todo} from "~/server/types"
import { api } from "~/utils/api";


export function CreateTodo() {
  const [newTodo, setNewTodo] = useState("");
  //フォームの入力管理
  //入力フィールド値はnewTodo, setNewTodoで状態が更新
  //useCOntextは非推奨?
  const trpc = api.useContext();
  //todo作成メソッド呼び出し,Todoがデータベースに保存 
  const { mutate } = api.todo.create.useMutation({
    //onMutate⇒mutationが実行される前に発火
    //⇒処理が成功したかどうか気にしない

    onMutate: async (newTodo) => {
      //キャッシュが上書きされないようクエリをキャンセル
      await trpc.todo.all.cancel();
      //getData()⇒すでにキャッシュに存在するデータを獲得するための関数
      const previousTodos = trpc.todo.all.getData();
      //setData()⇒クエリのキャッシュデータを即座に更新するために使用
      trpc.todo.all.setData(undefined, (prev) => {
        //新たに追加しようとするTodoはoptimisiticTodoに格納
        const optimisticTodo: Todo = {
          id: "optimisic-todo-id",//idにどんな値が入るか分からないため、仮のid付与
          //text: newTodo,
          text: "todo追加中・・・",
          isCompleted: false,
        };
        if(!prev) return [optimisticTodo];
        //仮idが付与されたTodoが追加されたTodoの一覧がキャッシュ
        return [optimisticTodo, ...prev];
      });
      //フィールドリセット
      setNewTodo("");
      //更新前Todoをreturn
      return { previousTodos };
    },
    //プロシージャで発生したすべてのエラーはクライアント送信前にonErrorを経由
    onError:(err, newTodo, context) => {
      //トーストメッセージを表示
      toast.error("Todo作成中にエラーが発生しました");
      //コンソールにエラーの内容を出力
      console.error(err);
      //Todoの内容を復活
      setNewTodo(newTodo);
      if(!context) return;
      //setData()を用いてTodoの一覧を取得する関数のキャッシュデータをprevioussTodosに変更
      trpc.todo.all.setData(undefined, () => context.previousTodos);
      //⇒エラー発生時に楽観的更新をロールバック
    },

   //API呼び出し後に実行、Todoリスト再度取得のため、キャッシュ無効化
   //onSettled⇒mutationが成功したかどうかに関わらず呼び出し
    onSettled: async () => {
    //Todoの作成の成功・失敗の結果をTodoの一覧表反映のため
    //楽観的処理が成功すると画面上Todoidとデータベース上idが不一致
    //trpc.todo.all.invalidate();によってidを正しいものに置き換え
    await trpc.todo.all.invalidate();
   },
 });

  return (
    //フォームの送信処理
    <form
      onSubmit={(e) => {
        e.preventDefault();
        //新しいToDoの入力値をバリデーションチェック  
        //createInput⇒~/server/types
        //safeParse⇒Zodのライブラリのメソッドの1つ、types.tsで決めてた
        const result = createInput.safeParse(newTodo);
        //newTodoの値が要件を満たさないとエラー
        if (!result.success) {
           //トーストメッセージ表示
            toast.error(result.error.format()._errors.join("\n"));
          return;
        }
        //toast("これはカスタムメッセージです");
        mutate(newTodo);
      }}
      className="flex justify-between gap-3"
    >
        {/*Todo入力フィールド作成*/}
      <input
        className="w-full appearance-none rounded border-gray-one py-2 px-3 leading-tight text-gray-four"
        type="text"
        placeholder="入力を待ってます..."
        name="new-todo"
        id="new-todo"
        //値はnewTodoへリアルタイムパディング
        //これは更新後のvalue
        value={newTodo}
        //イベント発生時
        onChange={(e) => {
            //newTodoの値が更新
            //このvalueはユーザがその瞬間に入力している最新の値
          setNewTodo(e.target.value);
        }}
      />
      <button className="group flex items-center rounded-md border-cream-four bg-green-one px-6 py-3 text-lg font-semibold text-gray-five outline outline-2 outline-offset-2 outline-green-one hover:text-green-five focus-visible:text-green-five focus-visible:outline-green-five">
        Create
        <svg
          className="ml-3 h-4 w-4 text-gray-five group-hover:text-green-five group-focus-visible:text-green-five"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_35_391)">
            <path
              d="M14.4 14.4V8H17.6V14.4H24V17.6H17.6V24H14.4V17.6H8V14.4H14.4ZM16 32C7.1632 32 0 24.8368 0 16C0 7.1632 7.1632 0 16 0C24.8368 0 32 7.1632 32 16C32 24.8368 24.8368 32 16 32ZM16 28.8C19.3948 28.8 22.6505 27.4514 25.051 25.051C27.4514 22.6505 28.8 19.3948 28.8 16C28.8 12.6052 27.4514 9.3495 25.051 6.94903C22.6505 4.54857 19.3948 3.2 16 3.2C12.6052 3.2 9.3495 4.54857 6.94903 6.94903C4.54857 9.3495 3.2 12.6052 3.2 16C3.2 19.3948 4.54857 22.6505 6.94903 25.051C9.3495 27.4514 12.6052 28.8 16 28.8V28.8Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_35_391">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </button>
    </form>
  );
}