import type { InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn({providers,}
    : InferGetServerSidePropsType<typeof getServerSideProps>) {
//getServerSidePropsで取得されたprovidersでサインインUI作成
//IngergetServerSidePropsTypeを使い、getServerSidePropsからのpropsの型推論
    return (
    <>
      <div className="min-h-screen bg-olive-one p-0 selection:bg-green-two md:py-24 md:px-8">
        {/*classnameでサイズや色などを指定？*/}
        クラス1
        <div className="flex flex-col items-center space-y-20 pt-40">
          クラス2(イメージクラス)
          <Image
            src="/images/github-icon.png"
            width={170}
            height={170}
            alt="github-icon"
          />
          {/*画像のリンクやサイズ等を設定*/}
          <div className="text-center">
            クラス3
            <div className="mx-auto max-w-3xl">
              クラス4
              <div className="flexjustify-center">クラス5</div>
              {/*クラス3~5の意図がわからん */}
              {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                  <button
                    className="inline-flex w-full cursor-pointer items-center justify-center rounded-md p-4 text-xl font-bold hover:text-green-five"
                    // このボタンを押すと GitHub による認証が行われます
                    // また、認証後のリダイレクト先をルートパスに設定しています
                    onClick={() =>
                      void signIn(provider.id, {
                        callbackUrl: "/",
                      })
                      //ボタンをクリックするとsignIn関数が呼ばれる
                    }
                  >
                     {provider.name}でサインイン
                    {/*provider.name⇒GitHub */}
                    {/* provider.callbackUrl⇒http://localhost:3000/api/auth/callback/github*/}
                    {/*provider.id⇒github */}
                    {/* provider.callbackUrl⇒http://localhost:3000/api/auth/signin/github*/}
                    {/*providers.type⇒oauth */}
                  </button>
                    <p>ここにボタンが表示</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  //ページがリクエストされるたびにgetServerSideProps実行
  const providers = await getProviders();
  //設定されている認証方法のリスト獲得

  return {
    props: { providers: providers ?? [] },
    //取得したprovidersをpropsとしてSignInコンポーネントに渡す
    //SignInは5行目から
  };
}
