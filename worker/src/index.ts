import puppeteer from "puppeteer";

async function main(meeting: string) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--use-fake-ui-for-media-stream",
      "--window-size=1080,720",
      "--auto-select-desktop-capture-source=[RECORD]",
      "--enable-usermedia-screen-capturing",
      '--auto-select-tab-capture-source-by-title="Meet"',
      "--allow-running-insecure-content",
    ],
  });

  const page = await browser.newPage();
  await page.goto(meeting);

  // Wait for the "Got it" button and click it
  await page.waitForSelector("button");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const targetButton = buttons.find((button) =>
      button?.textContent?.includes("Got it")
    );
    if (targetButton) {
      targetButton.click();
      console.log('Button with text "Got it" clicked');
    } else {
      console.log('Button "Got it" not found');
    }
  });

  try {
    await page.waitForFunction(
      () => {
        const input = document.querySelector("input[id=c11]");
        return input !== null;
      },
      { timeout: 10000 }
    );
    console.log("Input field found");

    const input = await page.$("input[id=c11]");
    if (input) {
      await input.focus();
      await input.type("Fathom.ai");
      console.log('Input value set to "Fathom.ai"');
    }
  } catch (error) {
    console.error("Input field not found:", error);
  }

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const targetButton = buttons.find((button) =>
      button?.textContent?.includes("Ask to join")
    );

    if (targetButton) {
      targetButton.click();
      console.log('Button with text "Ask to join" clicked');
    } else {
      console.log('Button with text "Ask to join" not found');
    }
  });
}

main("https://meet.google.com/bzb-cpmo-fwz");
