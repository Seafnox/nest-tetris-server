export const getClassName = function(instance): string {
  return instance.constructor ? instance.constructor.name : null;
};
