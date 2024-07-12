export class InstructionFilterValueConverter {
  toView(navigationInstructions) {
    return navigationInstructions
      ? navigationInstructions.filter(index => {
          return !!index.config.title;
        })
      : [];
  }
}
