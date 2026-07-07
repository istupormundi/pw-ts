import {test} from '@playwright/test'
import {PageManager} from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'
import { argosScreenshot } from "@argos-ci/playwright";

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test('navigate to Form page', async ({page}) => {
    const pageManager = new PageManager(page)
    await pageManager.navigateTo().formLayoutsPage()
    await argosScreenshot(page, "forLayoutsPage")
    await pageManager.navigateTo().datePickerPage()
    await argosScreenshot(page, "datePickerPage")
})

test('parameterized methos', async({page}) => {
    const pageManager = new PageManager(page)
    const fakerFullName = faker.person.fullName()
    const fakerEmail = `${fakerFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    await pageManager.navigateTo().formLayoutsPage()
    await pageManager.onFormLayoutsPage().submitUsingTheGridForm("test@test.com", "123al123!", "Option 1")
    await page.screenshot({path: 'screenshots/form-layouts-page.png', fullPage: true})
    await pageManager.onFormLayoutsPage().submitInlineForm(fakerFullName, fakerEmail, true)
    await page.locator('nb-card:has-text("Inline form")').screenshot({path: 'screenshots/inline-form.png'})
    const buffer = await page.screenshot()
    console.log(buffer.toString('base64'))
    await pageManager.navigateTo().datePickerPage()
    await pageManager.onDatepickerPage().selcetCommonDatepickerDateFromToday(4)
    await pageManager.onDatepickerPage().selectDatePickerWithRange(2, 14)
})