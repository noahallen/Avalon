# Avalon Git Repository Workflow

## Initial Setup

1. Download and use [VSCode](https://code.visualstudio.com/download) for development (This is what I use/recommend)

2. You will need to download git (and if you are using windows make sure you include the git credentials manager).
   Here is the link for the [Git download](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

3. Before you start using Git, configure your user name and email.

    ```
    git config --global user.name "Your Name"
    git config --global user.email "your.email@example.com"
    ```

4. Clone the repository (which downloads a local copy of the project to your computer):

    ```
    git clone https://github.com/noahallen/Avalon.git
    cd Avalon
    ```

5. You will need to download [Node](https://nodejs.org/en/download/current) (which includes npm). I downloaded version 21.6.0 (which includes npm 10.2.4)

6. Once you have the repository, git, and node downloaded, you should then install the needed dependencies for the project. To do this first you need to open a terminal in the project's folder (control + shift + ` in vscode).

    #### Then to install the dependencies on the client you:

    ```
    npm install
    ```
    
7. Download and place the .env file from the Discord into the root directory. This file contains the firebase api key and other private information. All of this information will only live locally, do not save it to git.

## Regular Development Workflow

1. Switch to the main branch and pull the latest changes:

    ```
    git switch main
    git pull
    ```

2. Create a new feature branch:

    ```
    git checkout -b "<Insert_name_of_feature_branch_here>"
    ```

3. Make changes and stage them for commit:

    #### To stage **specific** files

    ```
    git add <file_to_track>
    ```

    #### To stage **all** changes

    ```
    git add .
    ```

4. Commit your changes with a descriptive message:

    ```
    git commit -m "Message describing the changes you made in the commit"
    ```

5. Push your feature branch to the remote repository:
    #### **Note: If it's your first time pushing, follow the recommended command if prompted**
    ```
    git push
    ```

## Do When You Are Ready To Merge Changes

6. Create a Pull Request (PR) on GitHub and assign a team member for review.

7. After approval, ensure your feature branch is up to date with main using rebase:

    ```
    git switch main
    git pull
    git switch "<Insert_name_of_feature_branch_here>"
    git rebase main
    ```

8. Resolve any conflicts, if needed, during rebase.

9. Once in sync, merge the PR into the main branch in Github (should be a big green merge button)

10. Once you merge you should update your local main branch

    ```
    git switch main
    git pull
    ```

## Misc. Tips

1. If you aren't sure of the current status of your local branch, you can type `git status` in a terminal and it will output the current status of the branch.

2. If you aren't sure which branch you are on, you can type `git branch` and it will output a list of branches and highlight green which you are on. (FOr this to stop outputting branches type `q`)

3. To switch between branches you can type `git switch <branch name>`
