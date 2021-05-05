type AppSyncEvent = {
  info: {
    fieldName: String;
  };
};

exports.handler = async (event: AppSyncEvent) => {
  if (event.info.fieldName === "welcome") {
    return "Hello World";
  } else {
    return "Not Found";
  }
};
