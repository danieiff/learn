### twitter文字数制限
```json
{
  "version": 3,
  "maxWeightedTweetLength": 280,
  "scale": 100,
  "defaultWeight": 200,
  "emojiParsingEnabled": true,
  "transformedURLLength": 23,
  "ranges": [
    {
      "start": 0,
      "end": 4351,
      "weight": 100
    },
    {
      "start": 8192,
      "end": 8205,
      "weight": 100
    },
    {
      "start": 8208,
      "end": 8223,
      "weight": 100
    },
    {
      "start": 8242,
      "end": 8247,
      "weight": 100
    }
  ]
}
```

### Unicode
/\p{sc=Hira}/u
/\p{sc=Kana}/u
/\p{sc=Han}/u  // scxは🉑🉐㊗️🈶等が入る
/\p{Emoji}/u
/\p{Other}/u // Abb. C

eaF  = /\p{ea=F}/u   // 東アジアにおける文字幅分類：全角　（East_Asian_Width=Fullwidth）
eaW  = /\p{ea=W}/u   // 広い（等幅フォントなら全角）　    （ea=Wide）
eaA  = /\p{ea=A}/u   // 曖昧（等幅フォントなら全角かも）　（ea=Ambiguous）
eaN  = /\p{ea=N}/u   // 中立（等幅フォントなら半角かも）  （ea=Neutral）
eaNa = /\p{ea=Na}/u  // 狭い（等幅フォントなら半角）     （ea=Narrow）
eaH  = /\p{ea=H}/u   // 半角                          （ea=Halfwidth）

zen1 = /^\p{ea=F}+$/u                    // 全角文字列
zen2 = /^[\p{ea=F}\p{ea=W}]+$/u          // 全角らしい文字列
zen3 = /^[\p{ea=F}\p{ea=W}\p{ea=A}]+$/u  // 全角っぽい文字列
console.log( zen3.test( 'あＡα' ) )      // true

alpha = /^\p{Alpha}+$/u  // 国語（で使われるような記号でない普通の文字）

- 正規化
String.prototype.normalize()

### Chrome 
chrome://flags/#calculate-native-win-occlusion
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"--disable-backgrounding-occluded-windows
