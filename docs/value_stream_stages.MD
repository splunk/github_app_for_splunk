# Value Stream Mapping for DevSecOps

To better understand the flow of work from ideation to release, we can define a map of the steps that work must go through.

1. **Ideation** - Creating the initial idea for the work
1. **Acknowledgement** - Accepting the work and planning for it
1. **Working** - Working on the tasks
1. **Merge** - Completing the work
1. **Review** - Reviewing the completed work
1. **Testing** - Testing the work and preparing for release
1. **Pending** - Waiting for release
1. **Released** - Work is released

All work should fit into one of these categories and should reference an id for the Issue/Card/Task.

## Stage Definitions

### Ideation

This is the initial request for work, typically a task of some kind in a project management system.

These are the data types that would define this phase:
- Issue creation
- Project Card creation

### Acknowledgement

This is the phase where an idea has gone from the backlog, to a planning phase in a project management system.

These are the data types that would define this phase:
- Issue labeled as "to do"
- Issue assigned a sprint/milestone
- Project Card moved to a "to do" column

### Working

This is the phase where the idea becomes reality and is typically when code is being written.

These are the data types that would define this phase:
- Issue labeled as "in progress"
- Project Card moved to an "in progress" column
- Branch created
- First Push to main branch

### Merge

This is the phase where work on the task has been completed.

These are the data types that would define this phase:
- Issue labeled as "Done"
- Project Card moved to a "Done" column
- Pull Request created
- Last Push to main branch

### Review

This is the phase where a code change would be under review. The change would be complete but not ready for testing or release. This may or may not include CI testing or manual code reviews.

These are the data types that would define this phase:
- Issue labeled as "under review"
- Project Card moved to a "under review" column
- Pipeline/Workflow execution on a Pull Request begins
- Pull Request created

### Testing

This is the phase where code is undergoing automated testing through a CI process. This is distinct from the Review phase as it should be part of the release testing, not merge testing. This data is typically found within the CI tools being used.

These are the data types that would define this phase:
- Pipeline execution starts/ends

### Pending

This is the phase where code has been created, reviewed, tested, and approved and is typically measured more by the separation of events than any specific data point.

These are the data types that would define this phase:
- Pipeline execution complete
- Deployment started

### Released

This is the phase where the task is complete and is being used.

These are the data types that would define this phase:
- Issue closed
- Project Card moved to "released" column
- Kubernetes deployment
- Artifact uploaded
- Container pushed to registry
- Other customer specific markers
