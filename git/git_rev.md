@ HEAD

[<refname>]@{<date>}, e.g. master@{yesterday}, HEAD@{5 minutes ago} --since and --until.

<refname>@{<n>}, e.g. master@{1} the n-th prior

@{<n>}, e.g. @{1} get at a reflog entry of the current branch.

@{-<n>}, e.g. @{-1} the <n>th branch/commit checked out before the current one.

[<branchname>]@{upstream}, e.g. master@{upstream}, @{u}
[<branchname>]@{push}, e.g. master@{push}, @{push}

<rev>^[<n>], e.g. HEAD^, v1.5.1^0 the 

<rev>~[<n>], e.g. HEAD~, master~3 the <n>th generation ancestor of the named commit object

<rev>^{/<text>}, e.g. HEAD^{/fix nasty bug}
same as the :/fix nasty bug syntax below except that it returns the youngest reachable matching commit

:/<text>, e.g. :/fix nasty bug
the youngest commit whose commit message matches the specified regex  e.g. :/^foo. The special sequence :/! is reserved for modifiers to what is matched. :/!-foo performs a negative match, while :/!!foo matches a literal ! character, followed by foo. Any other sequence beginning with :/! is reserved for now.

<rev>:<path>, e.g. HEAD:README, master:./README
A suffix : followed by a path names the blob or tree at the given path in the tree-ish object named by the part before the colon. A path starting with ./ or ../ is relative to the current working directory. The given path will be converted to be relative to the working tree’s root directory. This is most useful to address a blob or tree from a commit or tree that has the same tree structure as the working tree.

:[<stage number (0 to 3)>:]<path>, e.g. :0:README, :README
A missing stage number (and the colon that follows it) names a stage 0 entry. During a merge, stage 1 is the common ancestor, stage 2 is the target branch’s version (typically the current branch), and stage 3 is the version from the branch which is being merged.


G   H   I   J Parent commits are ordered left-to-right.
  D   E   F
    \ | / |
      B   C
        A

H = D^2  = B^^2  = A^^^2  = A~2^2  = A^1^2^1

SPECIFYING RANGES
Specifying several revisions means the set of commits reachable from any of the given commits.

<rev> Include commits that are reachable from <rev>
^<rev> Exclude commits that are reachable from <rev>
^D B C                       E I J F B C

<rev1>..<rev2> Include reachable from <rev2> but exclude reachable from <rev1>.
B..C   = ^B C                C

<rev1>...<rev2> Include reachable from either <rev1> or <rev2> but exclude reachable from both. r1 r2 --not $(git merge-base --all r1 r2)
B...C  = B ^F C              G H D E B C

<rev>^-[<n>] includes <rev> but excludes the <n>th parent (shorthand for <rev>^<n>..<rev>), with <n> = 1 if not given.
useful for merge commits where you can just pass <commit>^- to get all the commits in the branch that was merged in merge commit <commit> (including <commit> itself).
B^-    = B^..B = ^B^1 B      E I J F B

r1^@ means all parents of r1. not commit itself
C^@    = C^1 = F             I J F

r1^! includes r1 but excludes all of its parents.
F^! D  = F ^I ^J D           G H D F
