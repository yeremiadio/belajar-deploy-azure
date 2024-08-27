  export const constructProperName = (
    firstname?: string,
    lastname?: string
  ): string => {
    let name = `${firstname ?? ''} ${lastname ?? ''}`.trim();
  
    // Replace multiple spaces with a single space
    name = name.replace(/\s+/g, ' ');
  
    if (name.length) return name;
    return '-';
  };