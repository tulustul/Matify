export class FilterService {

  filter(query: string, items: any[], fields: string[]) {
    let tokens = query.trim().split(' ').map(t => t.toLowerCase());

    return items.filter(item => {
      for (let token of tokens) {
        let tokenOk = false;
        for (let field of fields) {
          let content = (item[field] as string).toLowerCase();
          for (let value of content.split(' ')) {
            if (value.startsWith(token)) {
              tokenOk = true;
              break;
            }
          }
        }
        if (!tokenOk) {
          return false;
        }
      }

      return true;
    });
  }

  fuzzyFilter(query: string, items: any, field: string) {
    query = query.toLowerCase();
    return items.filter(item => {
      let itemName = item[field].toLowerCase();
      let i = 0;
      let ok = query.length === 0;
      for (let ch of query) {
        ok = false;
        while (i < itemName.length) {
          if (itemName[i] === ch) {
            ok = true;
            break;
          }
          i++;
        }
      }
      return ok;
    });
  }

}
