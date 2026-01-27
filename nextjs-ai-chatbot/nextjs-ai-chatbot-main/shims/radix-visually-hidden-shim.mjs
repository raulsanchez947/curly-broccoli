// Shim to provide the `VISUALLY_HIDDEN_STYLES` named export expected by some Radix packages.
// This imports the actual module implementation and re-exports everything while adding
// the missing named export.
import * as VH from '@radix-ui/react-visually-hidden';

// Mirror the inline styles used by the original implementation so consumers can import them.
export const VISUALLY_HIDDEN_STYLES = {
  position: 'absolute',
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  wordWrap: 'normal'
};

// Re-export all existing exports from the real package
export * from '@radix-ui/react-visually-hidden';

// Provide named exports that some Radix bundles expect
export const VisuallyHidden = VH.VisuallyHidden || VH.Root || VH.default;
export const Root = VH.Root || VH.VisuallyHidden || VH.default;

// Default export for consumers importing the package default
export default VisuallyHidden;
