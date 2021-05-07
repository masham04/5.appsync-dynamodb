import { type } from "os";

type AppSyncEvent = {
  info: {
    fieldName: String;
  };
  arguments: {
    product: Product;
  };
};
type Product = {
  id: String;
  name: String;
  price: Number;
};

exports.handler = async (event: AppSyncEvent) => {
  if (event.info.fieldName === "welcome") {
    return "Hello World";
  } else if (event.info.fieldName === "addProduct") {
    return;
  } else {
    return "Not Found";
  }
};
