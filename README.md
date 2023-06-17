# Check Changed Folder

This GitHub Action checks if a specified folder has been changed.

## Usage

To use this action, add the following step to your workflow:

```
- name: Check if Folder was Changed
  id: check_folder
  uses: codephi/actions-changed-folder
  with:
    path: 'path/to/check'
```

The `path` input specifies the folder path that you want to check for changes. The action will output a boolean `changed` value indicating whether the folder was changed or not.

You can then use the output value in subsequent steps of your workflow to conditionally execute tasks based on whether the folder was changed or not.

```
- name: Run Task if Folder was Changed
  if: steps.check_folder.outputs.changed == 'true'
  run: |
    # Your task here
```

## Inputs

- `path` (required): The path to the folder that you want to check for changes.

## Outputs

- `changed`: A boolean value indicating whether the folder was changed (`true`) or not (`false`).

## License

This action is licensed under the [CL0623](https://github.com/codephi/license-cl0623/blob/main/LICENCE.md).
