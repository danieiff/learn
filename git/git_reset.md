working index HEAD target         working index HEAD
----------------------------------------------------
 A       B     C    D     --soft   A       B     D
                          --mixed  A       D     D   git reset --mixed -N:  removed paths are marked as intent-to-add (see git-add[1]).
                          --hard   D       D     D
                          --merge (disallowed)
                          --keep  (disallowed)
----------------------------------------------------
 A       B     C    C     --soft   A       B     C
                          --mixed  A       C     C
                          --hard   C       C     C
                          --merge (disallowed)
                          --keep   A       C     C
----------------------------------------------------
 B       B     C    D     --soft   B       B     D
                          --mixed  B       D     D
                          --hard   D       D     D
                          --merge  D       D     D
                          --keep  (disallowed)
----------------------------------------------------
 B       B     C    C     --soft   B       B     C
                          --mixed  B       C     C
                          --hard   C       C     C
                          --merge  C       C     C
                          --keep   B       C     C
----------------------------------------------------
 B       C     C    D     --soft   B       C     D
                          --mixed  B       D     D
                          --hard   D       D     D
                          --merge (disallowed)
                          --keep  (disallowed)
----------------------------------------------------
 B       C     C    C     --soft   B       C     C
                          --mixed  B       C     C
                          --hard   C       C     C
                          --merge  B       C     C
                          --keep   B       C     C

reset --merge is meant to be used when resetting out of a conflicted merge. Any mergy operation guarantees that the working tree file that is involved in the merge does not have a local change with respect to the index before it starts, and that it writes the result out to the working tree. So if we see some difference between the index and the target and also between the index and the working tree, then it means that we are not resetting out from a state that a mergy operation left after failing with a conflict. That is why we disallow --merge option in this case.

reset --keep is meant to be used when removing some of the last commits in the current branch while keeping changes in the working tree. If there could be conflicts between the changes in the commit we want to remove and the changes in the working tree we want to keep, the reset is disallowed. That’s why it is disallowed if there are both changes between the working tree and HEAD, and between HEAD and the target. To be safe, it is also disallowed when there are unmerged entries.

The following tables show what happens when there are unmerged entries:
----------------------------------------------------
 X       U     A    B     --soft  (disallowed)
                          --mixed  X       B     B
                          --hard   B       B     B
                          --merge  B       B     B
                          --keep  (disallowed)
----------------------------------------------------
 X       U     A    A     --soft  (disallowed)
                          --mixed  X       A     A
                          --hard   A       A     A
                          --merge  A       A     A
                          --keep  (disallowed)
X means any state and U means an unmerged index.
