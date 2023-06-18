# Check Changed Folder

This GitHub Action checks if specified folders have been changed based on specific file patterns.

## Usage

To use this action, add the following step to your workflow:

```
- name: Check if Folders were Changed
  id: check_folders
  uses: codephi/actions-changed-folder
  with:
    folders: '{"Folder1": "services/app/*.js", "Folder2": "services/app/**"}'
```
The `folders` input should contain an object with the name of each folder as the key and the file pattern to check as the value. The action will output an object named "changed" with the name and change status of each folder.

You can then use the output value in subsequent steps of your workflow. For example:

```
- name: Perform Task for Folder1 if Changed
  run: |
    if [ ${{ steps.check_folders.outputs.changed.Folder1 }} == 'true' ]; then
      echo "Performing task for Folder1..."
      # Perform the task for Folder1
    else
      echo "Skipping task for Folder1 since it was not changed."
    fi
```

## Inputs

- `folders` (required): An object containing the name of each folder as the key and the file pattern to check as the value. The file pattern can use glob patterns to match specific files.

## Outputs

- `changed`: An object containing the name and change status of each folder.

Please make sure to replace the "folders" value in the usage example with your desired folder names and file patterns.

## License

This action is licensed under the [MIT License](LICENSE).

For inquiries or further information, please contact PF ASSIS INTERNET E TECNOLOGIA at contact@codephi.com.br.
