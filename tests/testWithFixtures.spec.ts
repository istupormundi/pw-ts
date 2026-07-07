import {test} from '../test-options'
import {faker} from '@faker-js/faker'

test('parameterized methos', async({page, pageManager}) => {
    const fakerFullName = faker.person.fullName()
    const fakerEmail = `${fakerFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    await pageManager.onFormLayoutsPage().submitUsingTheGridForm("test@test.com", "123al123!", "Option 1")
    await page.screenshot({path: 'screenshots/form-layouts-page.png', fullPage: true})
    await pageManager.onFormLayoutsPage().submitInlineForm(fakerFullName, fakerEmail, true)
})