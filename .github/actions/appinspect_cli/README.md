# Splunk AppInspect action

This action runs Splunk's AppInspect CLI against a provided a directory of a SPlunk App. 
It fails if the result contains any failures.


## Inputs

### `app-path`

**Required**: The path to directory of the app in the working directory.

### `result-file`
The file name to use for the json result.
`default`: `appinspect_result.json`

## Outputs

### `status`:  

`pass|fail`

## Example usage

```yml
uses: ./
with:
  app-path: 'test'
```
