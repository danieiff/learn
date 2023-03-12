### Cases
- 属性からの参照
  - itemref属性（グローバル属性）
  - form属性（フォームコントロール要素）
  - headers属性（th td要素）
  - list属性（input要素）
  - for属性（label要素）
  - for属性（output要素）
  - aria-activedescendantプロパティ
  - aria-controlsプロパティ
  - aria-describedbyプロパティ
  - aria-detailsプロパティ
  - aria-errormessageプロパティ
  - aria-flowtoプロパティ
  - aria-labelledbyプロパティ
  - aria-ownsプロパティ
- CSSのセレクタ
- DOM操作からの参照（getElementByIdやquerySelectorなど）
- URLフラグメント（URLの末尾の#で始まる識別子）
- 解析ツールなどのウェブビーコンの特定要素として
- スクレイピングの目印

---
Dynamic Id definition: React useId hook
Grobal Id definition: markuplint
```json
{
  "rules": {
    // IDの重複を警告する
    "id-duplication": true,
    // IDがハードコーディングされていたら警告する（動的生成を促す）
    "no-hard-code-id": true
  },
  "overrides": {
    // pagesディレクトリ内のファイルのみにルールを再定義
    "./src/pages/**/*": {
      "nodeRules": [
        {
          // URLフラグメント用に対象を見出しのみに絞る
          "selector": "h1,h2,h3,h4,h5,h6",
          "rules": {
            // ルールを無効化してIDのハードコーディングを許容する
            "no-hard-code-id": false
          }
        },
        {
          // Google Tag Managerトリガー
          "selector": "#gtm-trigger01,#gtm-trigger02",
          "rules": {
            // ルールを無効化してIDのハードコーディングを許容する
            "no-hard-code-id": false
          }
        }
      ]
    }
  }
}
```
