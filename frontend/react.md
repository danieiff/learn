### React best practices
## key
key prop instead of useEffect
key for list allowing duplication unless siblings
use list index for key is default but not proper
key is not used global. It's local
key is not passed, then the position (the number-th) of components among siblings

```tsx
<div>
  <ContactList
    contacts={contacts}
    selectedContact={to}
    onSelect={contact => setTo(contact)}
  />
  <Chat key={to.id} contact={to} /> // If key is not specified, Chat Input state is not changed among current contacts.
</div>

const contacts = [ { id: 0, name: 'Taylor'} { id: 1, name: 'Alice',} { id: 2, name: 'Bob',  } ]
```

## event
e.stopPropagation() stops the event handlers attached to the tags above from firing.
e.preventDefault() prevents the default browser behavior for the few events that have it.

### state
Same component at the same position (DOM Tree. Not JSX) preserves state
```tsx
<div>
  {isPlayerA ? ( <Counter person="Taylor" />) : ( <Counter person="Sarah" />)}// counter state is treated as one between these two Components
  <button onClick={() => setIsPlayerA(!isPlayerA)}> Next player!  </button>
</div>
```
```tsx
{isPlayerA && <Counter person="Taylor" /> }
{!isPlayerA && <Counter person="Sarah" /> }
// There go each two states
```
key prop ties Components in DOM with states ...add a key prop to Counter Components in first example.

Don't nest component definitions.  Because everytime the parent component renders, the child also re-create with fresh states

Only the number 0 left side of && operator will be rendered

### Props
```tsx
import { Button } from "library"; // but doesn't export ButtonProps! oh no!
type ButtonProps = React.ComponentProps<typeof Button>; // no problem! grab your own!
type AlertButtonProps = Omit<ButtonProps, "onClick">; // modify
const AlertButton = (props: AlertButtonProps) => (
  <Button onClick={() => alert("hello")} {...props} />
);
```

### Effects
useEffect runs twice in a development, but once in a production.
Assure it runs once per app load code below

```tsx
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Only runs once per app load
```
Code at the top level runs once when your component is imported
Keep app-wide initialization logic to root component modules.

Avoid "race condition" ...query input h -> he -> hello ... fetch with "he" may come before one with "hello".
With the below way, Last one result with query input will come in "results"

```tsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

import { flushSync } from 'react-dom'
useImperativeHandle
useDefferedValue ...useDebounce useThrottle ... put returned value to deps of useMemo
const [isPending, startTransition] = useTransition()

### Ref
```tsx
import { forwardRef, ReactNode, Ref } from "react";

interface Props {
  children?: ReactNode;
  type: "submit" | "button";
}

export const FancyButton = forwardRef(
  (
    props: Props,
    ref: Ref<HTMLButtonElement> // prevent mutate and reassign the ref
  ) => (
    <button ref={ref} className="MyClassName" type={props.type}>
      {props.children}
    </button>
  )
);
```

### Portal

```tsx
import { useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.querySelector("#modal-root") as HTMLElement;

interface ModalProps {
  children?: ReactNode;
}

const Modal = ({ children }: ModalProps) => {
  const el = useRef(document.createElement("div"));

  useEffect(() => {
    // Use this in case CRA throws an error about react-hooks/exhaustive-deps
    const current = el.current;

    // We assume `modalRoot` exists with '!'
    modalRoot!.appendChild(current);
    return () => void modalRoot!.removeChild(current);
  }, []);

  return createPortal(children, el.current);
};

export default Modal;
```

### テスト
テストランナーには Jest を使おう
コンポーネントのテストには react-testing-library を使おう
( react-testing-library ではなく @testing-library/react )
スナップショットテストには react-test-renderer を使おう (storybook)
e2e テストには Cypress を使おう

React公式ページ > テスト

### ライブラリ
Sweet Alert
multiselect-react-dropdown
rc-progress
react-dropdown-select
react-ellipsis-pjs
react-hot-toast

prettier
--no-semi
--trailing-comma none

### mui
```ts
const useStyles = makeStyles(_theme => ({
  btn: ({ isWidthLessThan600 }) => ({
    color: isWidthLessThan600 ? white : black
    }),
  txt: {
    fontSize: 13
  }
}))
const classes = useStyles({isWidthLessThan600: boolean })
```
