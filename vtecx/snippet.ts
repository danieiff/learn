// GET /d/?_service サービス名
// GET /{d|s}?_now サーバの現在時刻

const addAlias = (key_self: string, key_alias: string) => {
  const reqData = [
    {
      // id,
      link: [
        { ___rel: 'self', ___href: key_self },
        { ___rel: 'alternate', ___href: key_alias },
      ],
    },
  ]
  // PUT /d?_addalias
}

const removeAlias = (key_self: string, key_alias: string) => {
  const reqData = [
    {
      // id,
      link: [
        { ___rel: 'self', href: '{キー}' },
        { ___rel: 'alternate', ___href: '{alias}' },
      ],
    },
  ]
  // `PUT /d?_removealias`
}
