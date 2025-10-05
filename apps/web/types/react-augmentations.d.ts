import "react";

declare global {
  namespace React {
    type PromiseLikeOfReactNode = ReactNode;
  }
}
