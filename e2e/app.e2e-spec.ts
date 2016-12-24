import { Ngtest2Page } from './app.po';

describe('ngtest2 App', function() {
  let page: Ngtest2Page;

  beforeEach(() => {
    page = new Ngtest2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
