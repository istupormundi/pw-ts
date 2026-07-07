import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {
    //http://uitestingplayground.com/ajax
    await page.goto(process.env.URL) //await потомучто goto асинхронная функция, которая возвращает промис. И мы должны дождаться его выполнения, прежде чем продолжать выполнение теста
    //await page.goto('http://uitestingplayground.com/ajax')
    await page.locator('#ajaxButton').click()
})

//change timeout for a particular suite
/*
test.beforeEach(async({page}, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 2000)
})
*/

test('auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')
    const successText = await successButton.textContent()
    
    await successButton.waitFor({state: "attached"})
    const successText2 =  await successButton.allTextContents()

    expect(successText).toEqual("Data loaded with AJAX get request.")
    expect(successText2).toContain("Data loaded with AJAX get request.") //will be failed w\o waitFor()
    expect(successButton).toHaveText("Data loaded with AJAX get request.", {timeout: 20000})
})

test('alternative waits', async({page}) => {
    const successButton = page.locator('.bg-success')

    //wait for element
    //await page.waitForSelector('.bg-success')
    
    //OR wait for partucular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //wait for network calls to be completed (NOT RECOMMENDED)
    //await page.waitForLoadState('networkidle')

    //and others waits
    /*
    page.waitForEvent()
    page.waitForTimeout(2)
    page.waitForLoadState()
    ...
    */

    const text = await successButton.allTextContents()
    expect(text).toContain("Data loaded with AJAX get request.")
})

test('timeouts', async({page}) => {
    test.setTimeout(20000)
    test.slow() //x3 slower
    const successButton = page.locator('.bg-success')
    await successButton.click({timeout: 16000})

    //go to playwright.config.ts and set timeout inside defineConfig
    //afterthat this test will fail with err "Target closed"
})


