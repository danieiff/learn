## Spec

```gitcommit
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
h
```

- build:, chore:, ci:, docs:, style:, refactor:, perf:, test:, and others.

- a footer BREAKING CHANGE:, or appends a ! after the type/scope
- Each footer MUST consist of a word token, followed by either a :<space> or <space># separator, followed by a string value (this is inspired by the git trailer convention).
- A footer’s token MUST use - in place of whitespace characters, e.g., Acked-by (this helps differentiate the footer section from a multi-paragraph body).
  An exception is made for BREAKING CHANGE, which MAY also be used as a token.
- A footer’s value MAY contain spaces and newlines, and parsing MUST terminate when the next valid footer token/separator pair is observed.

## Examples

```gitcommit
revert: let us never again speak of the noodle incident

Refs: 676104e, a215868
```

## Automation

### CHANGELOG

### SemVer

- BREAKING CHANGE, feat, fix (major, minor, patch in SemVer)

### Build, Publish
