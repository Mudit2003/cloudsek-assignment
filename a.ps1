# Define the starting date and time
$baseDate = Get-Date "2024-11-12 22:28:28 +0530"

# Set author details
$authorName = "Mudit Rai"
$authorEmail = "raimudit2003@gmail.com"

# Loop while rebase is in progress
while ($true) {
    # Format the current date for Git (e.g., "Tue Nov 12 22:28:28 2024 +0530")
    $formattedDate = $baseDate.ToString("ddd MMM dd HH:mm:ss yyyy K")

    # Set GIT_COMMITTER_DATE and GIT_AUTHOR_DATE environment variables
    $env:GIT_AUTHOR_NAME = $authorName
    $env:GIT_AUTHOR_EMAIL = $authorEmail
    $env:GIT_COMMITTER_DATE = $formattedDate
    $env:GIT_AUTHOR_DATE = $formattedDate

    # Execute the commit with the specified date
    git commit --amend --date=$formattedDate --author="$authorName <$authorEmail>" --no-edit

    # Continue the rebase
    $rebaseResult = git rebase --continue

    # Check if rebase has completed
    if ($LASTEXITCODE -ne 0) {
        Write-Output "Rebase process complete or encountered an error. Exiting."
        break
    }

    # Increment the base date by 10 minutes for the next commit
    $baseDate = $baseDate.AddMinutes(10)
}
