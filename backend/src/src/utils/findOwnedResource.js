// Shared by projectController and taskController.
// Looks up a document by id, confirms it belongs to the requesting user,
// and writes the 404/403 response itself when it doesn't. Callers just
// check for a falsy return and `return;` — no repeated find/404/403 block.
export async function findOwnedResource(Model, id, userId, res, resourceName = "Resource") {
  const doc = await Model.findById(id);

  if (!doc) {
    res.status(404).json({
      success: false,
      message: `${resourceName} not found`,
    });
    return null;
  }

  if (doc.user.toString() !== userId) {
    res.status(403).json({
      success: false,
      message: `Not authorized to access this ${resourceName.toLowerCase()}`,
    });
    return null;
  }

  return doc;
}
