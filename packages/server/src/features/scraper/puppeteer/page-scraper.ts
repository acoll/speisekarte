import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

export abstract class PageScraper {
  abstract scrapePage(url: string): Promise<string>;
}

@Injectable()
export class PuppeteerPageScraper extends PageScraper {
  async scrapePage(url: string) {
    // Launch the browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    // Open a new tab
    const page = await browser.newPage();

    // Visit the page and wait until network connections are completed
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Interact with the DOM to retrieve the titles
    const texts = await page.evaluate(() => {
      // Select all elements with crayons-tag class
      return Array.from(document.querySelectorAll('p'))
        .map((el) => el.textContent)
        .filter((str): str is Exclude<typeof str, null> => !!str);
    });

    // Don't forget to close the browser instance to clean up the memory
    await browser.close();

    return texts.join('\n');
  }
}

@Injectable()
export class MockPageScraper extends PageScraper {
  async scrapePage() {
    return `Ingredients:
    1 cup all-purpose flour
    2 tablespoons sugar
    1 teaspoon baking powder
    1/2 teaspoon baking soda
    1/4 teaspoon salt
    3/4 cup buttermilk (or regular milk with a splash of vinegar or lemon juice)
    1/4 cup milk
    1 large egg
    2 tablespoons melted butter (plus more for cooking)
    1 teaspoon vanilla extract (optional)
    Instructions:
    Mix Dry Ingredients: In a large bowl, whisk together the flour, sugar, baking powder, baking soda, and salt.
    Combine Wet Ingredients: In another bowl, whisk together the buttermilk, milk, egg, melted butter, and vanilla extract (if using).
    Combine Wet and Dry: Pour the wet ingredients into the dry ingredients and stir until just combined. It's okay if there are a few lumps.
    Heat the Pan: Heat a non-stick skillet or griddle over medium heat and add a small amount of butter.
    Cook the Pancakes: Pour about 1/4 cup of batter onto the skillet for each pancake. Cook until bubbles form on the surface and the edges look set, then flip and cook until the other side is golden brown.
    Serve: Serve warm with your favorite toppings, such as maple syrup, fresh fruit, or whipped cream.`;
  }
}
