```ts
type OrderID = string & { readonly brand: unique symbol }
type UserID = string & { readonly brand: unique symbol }
type ID = OrderID | UserID

function isOrderID(id: string): id is OrderID {
  return true
}
const isUserID = (id: string): id is UserID => {
  return true
}

function orderid(id: string): OrderID {
  return id as OrderID
}

function userid(id: string): UserID {
  return id as UserID
}

const id: ID = userid('a7')
```
