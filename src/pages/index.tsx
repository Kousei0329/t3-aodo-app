import Head from "next/head";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { CreateTodo } from "~/components/CreateTodo";
import { Todos } from "~/components/Todos";

function Home() {
  const { data: sessionData, status } = useSession();
  //認証情報取得
  //sessionData⇒認証済みならユーザオブジェクト、されていなければnull
  //status⇒loading(認証情報取得中), unauthenticated(非認証), authenticated(認証済み)が入る
  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="Full stack todo app" />
        <link rel="icon" href="/favicon.ico" />
        {/*このリンクはタグのアイコンになってる */}
      </Head>
      <div className="min-h-screen bg-olive-one p-0 selection:bg-green-two md:py-24 md:px-8">
        クラス1{/*ヘッダーかな */}
        <main className="mx-auto min-h-screen max-w-none rounded-none bg-cream-four px-5 pt-24 pb-10 outline-none md:max-w-[60rem] md:rounded-2xl md:px-8 md:outline md:outline-4 md:outline-offset-8 md:outline-cream-four">
          メイン1{/*おそらく外枠 */}
          <h1 className="mb-6 text-center text-4xl font-bold text-gray-three">
            ToDo リスト
          </h1>
          {/*ロード中作ろうと思ったけど表示されなかった */}
          {status=="loading" &&sessionData && (
            <>
            <div>
              <p className="text-l text-white mb-4 text-center">
                <span>ロード中</span>
              </p>
            </div>
            </>
          )}

          {status !== "loading" && sessionData && (
           //以下、認証されている場合の表示
            <>
              <div className="flex flex-col items-center">
                <p className="text-l text-white mb-4 text-center">
                  <span>{sessionData.user?.email}でログイン中</span>
                </p>
                <button
                  className="mb-8 inline-flex cursor-pointer items-center justify-center rounded-md py-2 px-4 font-semibold outline outline-2 outline-offset-2 outline-green-one hover:text-green-five"
                  onClick={() => void signOut()}
                >
                {/*サインアウトボタン*/}
                  サインアウト
                </button>
              </div>
              <div>
                <CreateTodo />
                <Todos/>
                </div>
            </>
          )}
          {status !== "loading" && !sessionData && (
            //以下、認証されていない場合の表示
            <div className="flex flex-col items-center">
              <button
                className="mb-5 inline-flex cursor-pointer items-center justify-center rounded-md py-2 px-4 font-semibold outline outline-2 outline-offset-2 outline-green-one hover:text-green-five"
                onClick={() => void signIn()}
              >
                サインイン
              </button>
              <div className="mb-5 text-xl">
                <p className="text-center text-gray-four">
                 todoリストで人生変わる
                </p>
                <p className="text-center text-gray-four">
                  究極のプロダクトツール
                </p>
              </div>
              <div className="">
                <Image
                  src="/images/main-img.png"
                  width={600}
                  height={600}
                  alt="main-img"
                />
                {/*メインアイコン表示 */}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default Home;