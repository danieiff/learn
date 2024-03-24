     / A---B---C topic (current branch)        ->                            master
D---E---F---G master                   git rebase master (topic)   D---E---F---G---A'--B'--C' topic
                                                                              

Here is how you would transplant a topic branch based on one branch to another, to pretend that you forked the topic branch from the latter branch 
    o---o---o---o---o  master                                                     o---o---o---o---o\  master                  
         \                                                     ->                     |             o'--o'--o'  topic
          o---o---o---o---o\ next            git rebase --onto master next topic      o---o---o---o---o  next
                            o---o---o topic  
    

                       /H---I---J topicB                                                   H'--I'--J'  topicB
             /E---F---G  topicA                       ->                                   |/E---F---G  topicA
A---B---C---D  master                git rebase --onto master topicA topicB    A---B---C---D  master


E---F---G---H---I---J  topicA
git rebase --onto topicA~5 topicA~3 topicA
E---H'---I'---J'  topicA
This is useful if F and G were flawed in some way, or should not be part of topicA. argument to --onto and <upstream> can be any valid commit-ish.


--onto <newbase>
Starting point at which to create the new commits. If the --onto option is not specified, the starting point is <upstream>. May be any valid commit, and not just an existing branch name.

--autosquash

RECOVERING FROM UPSTREAM REBASE
someone develops a subsystem branch, which topic branch dependent on
o---o---o---o---o---o---o---o  master
 \
  o---o---o---o---o  subsystem
                   \
                    *---*---*  topic
If subsystem is rebased against master,
    o---o---o---o---o---o---o---o  master
     \			                     \
      o---o---o---o---o	          o'--o'--o'--o'--o'  subsystem
                       \
                        *---*---*  topic
If you now continue development as usual, and eventually merge topic to subsystem, the commits from subsystem will remain duplicated forever:
    o---o---o---o---o---o---o---o  master
         \			                 \
          o---o---o---o---o	      o'--o'--o'--o'--o'--M	 subsystem
                           \                         /
                            *---*---*-..........-*--*  topic
Such duplicates clutter up history, making it harder to follow. To clean things up, you need to transplant the commits on topic to the new subsystem tip, This becomes a ripple effect: anyone downstream from topic is forced to rebase too, and so on!

Easy case:
The changes are literally the same. This happens if the subsystem rebase was a simple rebase and had no conflicts.
Only works if the changes (patch IDs based on the diff contents) on subsystem are literally the same before and after the rebase subsystem did.
 $ git rebase subsystem you will end up with the fixed history

Hard case:
The changes are not the same.
This happens if the subsystem rebase had conflicts, or used --interactive to omit, edit, squash, or fixup commits; or if the upstream used one of commit --amend, reset, or a full history rewriting command like filter-repo.

The idea is to manually tell git rebase "where the old subsystem ended and your topic began", that is, what the old merge base between them was. You will have to find a way to name the last commit of the old subsystem, for example:

With the subsystem reflog: after git fetch, the old tip of subsystem is at subsystem@{1}. Subsequent fetches will increase the number. (See git-reflog[1].)

Relative to the tip of topic: knowing that your topic has three commits, the old tip of subsystem must be topic~3.

You can then transplant the old subsystem..topic to the new tip by saying (for the reflog case, and assuming you are on topic already):
$ git rebase --onto subsystem subsystem@{1}
