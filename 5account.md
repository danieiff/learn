ユーザ、グループ管理とアクセスコントロール

### メールアドレスとアカウント
vte.cxではユーザ登録の際にメール認証によって本人確認を行う
メールアドレスがログインIDとなります。
- valid e-mail addressに従います。
メールアドレスは１つで複数の受信が可能となるような記述方法がある
- +以降@までを無視して送信しますが受信では無視しません。
- ピリオド(.)無視
- Gmailのルールに合わせる
- メールアドレスとは別のアカウント管理を行っています

<!-- 以下途中までノータッチ -->
ユーザアカウントの仕様

入力されたメールアドレスを以下のルールで変換しシステムで一意なユーザアカウントとします。

メールアドレスを小文字に変換
アカウント利用可能文字である、英数字、ハイフン(-)、アンダースコア(_)、@、$、ドット(.) 以外を削除
メールアドレスの@より前の文字列について、ドット(.)を削除
ユーザアカウントはuid(ユーザ識別番号)と関連づけられます。uidはシステムで自動的に振られる一意の連番です。

ユーザエントリ

ユーザは各サービスの/_user/{uid}エントリで管理されます。これをユーザエントリといいます。
contributor.emailにオリジナルのメールアドレス
summaryにユーザの状態(ステータス)
titleにユーザアカウント
subtitleにニックネーム
GET /d/?_whoamiを実行すると現在ログインしているユーザエントリが返ります。(ログインしていない場合、HTTPステータスコード401を返却します。)

 <feed>
<entry>
  <contributor>
    <email>foo.bar@vte.cx</email>
  </contributor>
  <id>/_user/216,2</id>
  <link href="/_user/216" rel="self" />
  <summary>Activated</summary>
  <title>foobar@vte.cx</title>
  <subtitle>nickname</subtitle>
  <published>2018-06-09T11:08:38.122+09:00</published>
  <updated>2018-06-09T13:38:15.360+09:00</updated>
</entry>
</feed>
ユーザステータスには以下の種類があります。

登録なし: Nothing
仮登録：Interim
本登録：Activated
無効：Revoked
退会：Cancelled
ユーザ登録画面から仮登録を実行するとステータスがInterimになりユーザに確認メールが送信されます。メール内のリンクをクリックすることで本人認証がなされステータスが本登録(Activated)に変わります。Activatedになることではじめてサービスを使うことができるようになります。
また、ユーザ管理者によってユーザを追加することもできます。詳しくは、「管理者によるユーザ登録」を参照してください。
ユーザ管理者は PUT /d/?_revokeuser={ユーザアカウント}を実行することでアカウントを一時的に無効(Revokded)にすることができます。有効にするには、PUT /d/?_activateuser={ユーザアカウント}を実行します。
また、DELETE /d/?_canceluserで、ログインユーザのステータスを「Cancelled」(退会)に変更できます。これは、ログインユーザ自身のみ実行可能です。

uid検索

GET /d/?_uidを実行するとログイン中のuidを返却します。戻り値にはfeedのtitleにuidがセットされます。ログインしていない場合、HTTPステータス401を返却します。

ユーザアカウント検索

GET /d/?_accountを実行するとログイン中のユーザアカウントを返却します。戻り値にはfeedのtitleにユーザアカウントがセットされます。ログインしていない場合はHTTPステータス401を返却します。

ログインとログアウト

ログイン画面からログインIDとパスワードを入力して実行することでログイン認証が行われセッションを開始します。このとき、ログイン画面からはGET /d/?_loginが実行されます。また、パスワードはハッシュ化され、ワンタイムトークン(WSSE)としてリクエストされます。２回のログイン認証に失敗するとreCAPTCHAによる認証が必要になります。ログインロジックの詳細については、vtecxblankプロジェクトのログイン画面のソースを参照してください。ユーザアプリケーション作成の際にはこのログイン画面をカストマイズするとよいでしょう。
GET /d/?_logoutが実行されるとログアウトされセッションが破棄されます。

ユーザ仮登録

ユーザ仮登録はPOST /d/?_adduserで以下のエントリを登録すると実行されます。
機械的に実行されることを防ぐためreCAPTCHAが要求されます。

<feed>
  <entry>
    <contributor>
      <uri>urn:vte.cx:auth:{ユーザアカウント},{パスワード}</uri>
      <name>{ニックネーム}</name>
    </contributor>
    <title>{メールのタイトル(省略可)}</title>
    <summary>
    {テキストメール本文(省略可)}
    </summary>
    <content>
   {HTMLメール本文(省略可)}
    </content>
  </entry>
</feed>
上記を実行すると、summaryタグもしくは、contentタグに記述された文章とタイトル(titleタグ)がメール送信されます。contentにはHTMLメール(任意)を、summaryにはテキストメール(必須)を記述してください。HTMLメールを表示できない場合はテキストメールになります。
メール送信内容は、以下のように /_settings/adduserエントリにも記述できます。上記エントリのsummary、content、titleが省略された場合は、/_settings/adduserエントリの内容でメール送信します。上記エントリのメール送信内容が存在せず、かつ、/_settings/adduserエントリーも存在しない場合、?_adduserがリクエストされるとHTTPステータス412(Precondition Failed)が返ります。
また、メール送信するには、 /_settings/propertiesにメール送信設定が記述されている必要があります。詳しくは、各種設定情報の「プロパティ情報」を参照してください。

<entry>
  <link rel="self" href="/_settings/adduser" />
  <title>{メールのタイトル}</title>
  <summary>
{テキストメール本文}
  </summary>
  <content>
{HTMLメール本文}
</content>
</entry>
メールの本文には、ワンタイムトークン(RXID)が付いたリンクを含む必要があります。メールの本文に${RXID=Key}を挿入することで、RXIDを含むURLが自動的に組み立てられます。ユーザがこのリンクをクリックするまでは仮登録となります。

初期フォルダ作成

　また、以下のようにadduserinfoエントリのsummaryタグにフォルダのキーを設定することで、最初にログインしたタイミングで自動的にフォルダが作成されます。
キー情報の"#"部分は登録時のユーザ(uid)で置換されます。

<entry>
  <link rel="self" href="/_settings/adduserinfo" />
  <summary>
{ユーザ登録時に作成するフォルダのキー}
/#/aaaa
/#/bbbb
....
  </summary>
</entry>
vtecxblankプロジェクトには、ユーザ仮登録の画面が用意されています。ユーザアプリケーション作成の際にはこの画面をカストマイズするとよいでしょう。

パスワードリセット

パスワードリセットはPOST /d/?_passresetで以下のエントリを登録することで実行されます。機械的に実行されることを防ぐためreCAPTCHAが要求されます。

<feed>
  <entry>
    <contributor>
      <uri>urn:vte.cx:auth:{ユーザアカウント}</uri>
    </contributor>
    <title>{メールのタイトル(省略可)}</title>
    <summary>
    {テキストメール本文(省略可)}
    </summary>
    <content>
   {HTMLメール本文(省略可)}
    </content>
  </entry>
</feed>
上記を実行すると、summaryタグ(テキストメール)もしくは、contentタグ(HTMLメール)に記述された文章がメール送信されます。メール送信内容は、以下のように/_settings/passresetエントリにも記述できます。上記エントリのsummary、content、titleが省略された場合は、/_settings/passresetエントリの内容でメール送信します。
メールにはワンタイムトークン(RXID)リンクを含む必要があります。
ユーザがこのリンクをクリックすることでパスワードを再設定します。
上記エントリにメール送信情報がなく、 /_settings/passresetエントリーにも存在しない場合、?_passresetがリクエストされるとHTTPステータス412(Precondition Failed)が返ります。

　vtecxblankプロジェクトには、パスワードリセットの画面が用意されています。ユーザアプリケーション作成の際にはこの画面をカストマイズするとよいでしょう。

パスワード変更

パスワード変更はPUT /d/?_changephashで以下のエントリを更新することで実行されます。ログイン中のアカウントに対して実行するため、reCAPTCHAは要求されません。

<feed>
  <entry>
    <contributor>
      <uri>urn:vte.cx:auth:,{パスワード}</uri>
    </contributor>
  </entry>
</feed>
vtecxblankプロジェクトには、パスワード変更の画面が用意されています。ユーザアプリケーション作成の際にはこの画面をカストマイズするとよいでしょう。

管理者によるユーザ登録

?_adduserByAdminパラメータを付けて以下を実行することで新規ユーザを登録します。

これはユーザ管理者のみが実行できます。
複数のエントリを指定することで同時に複数のユーザを登録できます。
本人認証（メールリンクをクリック）しなくても本登録になります。
ユーザ登録時に/_settings/adduserinfoに設定した初期フォルダが作成されます。
titleタグおよびsummary、contentにメール情報をセットすることで実行時にメールを送信することができます。
ただし、メール送信のための設定が/_settings/propertiesエントリに記述されている必要があります。詳しくは、各種設定情報の「プロパティ情報」を参照してください。
titleタグおよびsummary、contentが省略されており、かつ、/_settings/adduserByAdminエントリが登録されている場合、このエントリの内容でメールが送信されます。
POST|PUT /d?_adduserByAdmin

<feed>
   <entry>
     <contributor>
       <uri>urn:vte.cx:auth:{メールアドレス},{パスワード}</uri>
       <name>{ニックネーム}</name>
     </contributor>
     <title>メールのタイトル(任意)</title>
     <summary>テキストメール本文(任意)</summary>
     <content>HTMLメール本文(任意)</content>
   </entry>

   ...
 </feed>
管理者によるパスワード変更

?_changephashByAdminパラメータを付けて以下を実行することでパスワードを変更します。

これはユーザ管理者のみが実行できます。
?_adduserByAdminで作成されたユーザのパスワードのみ変更できます。
リクエストデータに対象UIDとパスワードを指定します。指定したUIDのユーザのパスワードが更新されます。
PUT /d?_changephashByAdmin

<feed>
<entry>
<contributor>
<uri>urn:vte.cx:auth:,{パスワード}</uri>
</contributor>
<link href="/_user/{UID}/auth" rel="self" />
</entry>

...
</feed>
アカウント変更

PUT /d?_changeaccountでアカウント変更のためのメール送信を行います。これはログインユーザ自身のみ実行可能です。

メールのタイトルと本文についてリクエストに指定されていればそれを使用し、指定されていなければ/_settings/changeaccountエントリーの設定内容を送信します。
実際にアカウントを更新する際には認証コードが必要になります。メール本文に認証コード変換文字列${VERIFY}を指定してください。
<feed>
<entry>
<contributor>
<uri>urn:vte.cx:auth:{メールアドレス}</uri>
</contributor>
<title>メールのタイトル(任意)</title>
<summary>メールの本文(任意)</summary>
</entry>
</feed>
PUT /d?_changeaccount_verify={認証コード}で実際にアカウント変更を実行します。

注) サービス作成者のアカウント変更を行う場合、作成したサービスとシステム管理サービスそれぞれについてアカウント変更を実施してください。 アカウント名が一致していないと、システム管理サービスから作成したサービスへのログインができません。

アカウント削除

DELETE /d?_deleteuser={アカウント|uid}で指定されたアカウントの削除を行います。アカウントかuidのいずれかを指定できます。

DELETE /d?_deleteuserで本文(body)にアカウントエントリを指定することで複数のユーザを削除できます。

<feed>
    <entry>
    <link rel="self" href="/_user/{uid}" />
    <title>{アカウント|uid}</title>
    </entry>
    ・・・
    </feed>
システムグループ

システムグループは複数のユーザーの権限をまとめて管理するために、システムがあらかじめ定義しているグループです。
つまり、 /_groupフォルダ配下にグループエントリ、その配下にuidエントリを作成し、/_user/{uid}/groupへのaliasを付与することで、ユーザ(uid)がシステムグループに参加したものとして認識されます。uidはサービスを作成した本人のものが使われます。

例：サービス管理者権限のグループエントリ

<feed>
  <entry>
    <id>/_group/$admin/216,3</id>
    <link href="/_group/$admin/216" rel="self" />
    <link href="/_user/216/group/$admin" rel="alternate" />
    <published>2018-06-07T14:32:40.444+09:00</published>
    <updated>2018-06-09T11:08:47.328+09:00</updated>
  </entry>
</feed>
/_group/$adminグループに属することでサービス管理権限が付与されます。
システムグループには以下のものがあります。
(システムグループは $adminのように$で始まる名前のグループです）

サービス管理権限：/_group/$admin
サービスの作成、削除、アプリケーションログの参照やACLやindexなどの設定が可能
<contributor>タグおよび、<rights>タグの内容を自由に編集可能
/_settingsフォルダにはサービス管理権限のACL(CRUD)が付与されている
ユーザ管理権限：/_group/$useradmin
ユーザの作成、削除、ユーザステータスの変更、パスワード変更が可能
コンテンツ管理権限：/_group/$content
HTMLやJavaScript等のページやコンテンツの登録、削除が可能
<content>タグのテキストノードの内容を自由に更新可能
ユーザ作成グループ

ユーザ作成グループはユーザが自由に定義できるグループで/_user/{uid}配下にあるものです。
/_user/{uid}/group/{グループ名} というエントリを作成することで、ユーザ作成グループを作ることができます。
※ユーザ作成グループは署名が必要です。詳しくは署名を参照してください。

グループ署名のパターンには、以下の２つがあります。グループ署名は作成者、参加者双方の署名を必須とします。

①親がグループを作成→子がそのグループに参加申請→親が署名して参加承認
②親がグループを作成→親が子に参加依頼→子が署名して参加
例)
    * グループ名: /_user/123/mygroup -> created uid=123

    * グループ作成者uid: 123
    * グループ参加者uid: 456

    ①の場合
    * 子がそのグループに参加申請
    * 以下のエントリーを登録
        * idキー: /_user/123/mygroup/456
        * alias: /_user/456/group/mygroup
    * 以下のキーに署名
        * alias: /_user/456/group/mygroup uid=456
    * 親が署名して参加承認
        * idキー/_user/123/mygroup/456のtitleに署名。uid=123
    * 参加者のグループ参加チェック
        * /_user/456/group配下をfeed検索
        * /_user/456/group/mygroupのidキーが/_user/123/mygroup/456なので、署名検証を行う。(/_groupで始まらない、かつ自uidとグループ名のUIDが異なるため)
            * /_user/123/mygroup/456の署名検証を行う。uid=123
            * /_user/456/group/mygroupの署名検証を行う。uid=456

    ②の場合
    * 親が子に参加依頼
    * 以下のエントリーを登録
        * idキー: /_user/123/mygroup/456
        * alias: /_user/456/group/mygroup
    * 以下のキーに署名
        * idキー: /_user/123/mygroup/456 uid=123
    * 子が署名して参加
        * alias/_user/456/group/mygroupのtitleに署名。uid=456
    * 参加者のグループ参加チェック
        * /_user/456/group配下をfeed検索
        * /_user/456/group/mygroupのidキーが/_user/123/mygroup/456なので、署名検証を行う。(/_groupで始まらない、かつ自uidとグループ名のUIDが異なるため)
            * /_user/123/mygroup/456の署名検証を行う。uid=123
            * /_user/456/group/mygroupの署名検証を行う。uid=456
フォルダACL

vte.cxでは、これまで述べたように、エンドポイントURLをフォルダに見立てて、その配下にリソースを格納できます。また、そのフォルダにACLを設定することで自身および配下のエントリについてアクセスコントロールを設定できます。
ACLは以下のようにエントリのcontributorタグに指定します。特定のユーザ(uid)、ログイン済ユーザ(+)、すべてのユーザ( *)、あるいはグループ(GroupKey)を設定できます。グループ指定ではワイルドカードの指定も可能です。(/group*など)

<contributor>
    <uri>urn:vte.cx:acl:{uid|*|+|GroupKey},{C|R|U|D|E|.|/}</uri>
</contributor>
ACLの種類 (複数指定可能だが「E」「.」「/」のみの指定は不可)

C : 登録処理を許可
R : 検索処理を許可
U : 更新処理を許可
D : 削除処理を許可
E : サーバサイドJavaScriptからのみデータ操作可でHTTP(S)からのデータ操作が不可となる。
. : Own このエントリのみ適用される。配下のエントリには適用されない。
/ : Low このエントリより配下のものについて適用される。指定したエントリ自体には適用されない。
Own.Low/いずれも設定されていない場合は両方(./)が付いているとみなされる
権限のスコープ

数字 : ログインしているユーザ(uid)が対象
先頭と末尾にワイルドカード(*)を指定可能
* : ログインしていないユーザを含むすべてのユーザが対象
+ : ログインしているすべてのユーザが対象
スラッシュ(/)で始まるもの : グループ(GroupKey)が対象
ACLの適用範囲

自身の階層を含む上位階層のACLが適用される。
つまり、自身にはACL設定がなくても親フォルダ（さらに上も）に設定されていれば親のACLが有効になる。
親フォルダにACLが設定されて、かつ、自身にもACLが設定されている場合、自身の設定が優先される。
同様に、配下のエントリにACLの設定がある場合、上位階層で設定されたACLではなく配下のエントリのACLが有効となる。
検索結果のうち参照権限がないエントリについては検索結果に含められない。
aliasのキーについてもACLが適用される。
ACLの追加と削除

以下をリクエストすることでACLを追加できます。

PUT /d/?_addacl

<feed>
  <entry>
    <link rel="self" href="{キー}" />
    <contributor>
      <uri>urn:vte.cx:acl:{ACL対象},{権限}</uri>
    </contributor>
  </entry>
</feed>
また、PUT /d/?_removeaclで指定したACLを削除できます。

項目ACL

/_settings/templateエントリのタグに記述することで項目に対してACLを設定することができます。ACLにはユーザおよびグループの読込(R)または書込(W)権限を指定できます。
以下のように、項目名に続けて=の後に、{uid|group}+{RW}の形式でACLを指定します。 ,(カンマ)で複数件指定できます。

subInfo.favorite.food=3+W,/grp1+W,/*+R 　
/_settings/templateエントリのrightsタグにはIndexも指定できますが、以下のようにindexとACLを同時に記述することができます。:コロンの右辺がIndex、=の右辺がACLになります。

subInfo.favorite3.food:/[0-9]+/(self|alias)=1+W　　
暗号化項目

項目名に続けて#を付けると暗号化項目となります。Index項目と暗号化項目はどちらか一つを指定できます。 暗号化では、vte.cx内部で持っている秘密Key(usersecret)とidと組み合せてハッシュ化したものが実際の暗号化において使われます。
　以下はcontributor.uriを暗号化する設定例です。

contributor.uri#　　　　　　　　　　　　　
　また、以下のように、暗号化と項目ACLは同時に設定できます。これは、rightsの暗号指定、かつ、自身と/_group/$adminグループのRW権限の付与を意味します。

rights#=@+RW,/_group/$admin+RW　　

///　
ユーザーが作成されると
以下が生成される
1. UID
2. 以下のディレクトリ
- `/user/{UID}`
- `/user/{UID}/acesskey`
- `/user/{UID}/group`
- `/user/{UID}/login_history`
3. `/setup/_settings/adduserinfo.xml`で定義されたフォルダ
```xml: /setup/_settings/adduserinfo.xml
/_user/123/items
/_user/123/general
/_user/123/mail
/_user/123/bookmark
```