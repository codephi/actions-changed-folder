# Check Changed Folder

This GitHub Action checks if specified folders have been changed.

## Usage

To use this action, add the following step to your workflow:

```
- name: Check if Folders were Changed
  id: check_folders
  uses: codephi/actions-changed-folder
  with:
    folders: '[{"name": "Folder1", "directory": "path/to/folder1"}, {"name": "Folder2", "directory": "path/to/folder2"}]'
```

The `folders` input specifies the list of folders to check. Each folder object should have a `name` and `directory` field. The action will output an object named "changed" with the name of each folder and a boolean value indicating if it was changed or not.

You can then use the output value in subsequent steps of your workflow. For example:

```
- name: Perform Task for Changed Folders
  run: |
    ${{ each folder in steps.check_folders.outputs.changed }}
    if [ ${{ folder.changed }} == 'true' ]; then
      # Perform task for the changed folder
    fi
```

## Inputs

- `folders` (required): A JSON string representing a list of folder objects to check. Each object should have a `name` and `directory` field.

## Outputs

- `changed`: An object containing the name and change status of each folder.

Please make sure to replace the "folders" value in the usage example with your desired folder names and directories.

## License

This action is licensed under the [MIT License](LICENSE).

For inquiries or further information, please contact PF ASSIS INTERNET E TECNOLOGIA at contact@codephi.com.br.
