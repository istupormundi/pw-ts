import {test, expect} from '@playwright/test'

test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('locator syntax rules', async ({page}) => {
    //find locator by tag name
    await page.locator('input').first().click()

    //find locator by id
    // use # before value for id
    await page.locator('#inputEmail1').click()

    //find locator by class value
    // use . before value for class value
    page.locator('.shape-rectangle')

    //find locator by attribute
    // use [] for attribute and value
    page.locator('[placeholder="Email"]')

    //find locator by entire class value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different selectors
    //don't put a space between them
    page.locator('input[placeholder="Email"][nbinput]')

    //find element by XPath
    // use // for XPath and put expression in ''
    //NOT RECOMMENDED, because XPath is slower than other selectors and less readable
    page.locator('//*[@id="inputEmail1"]')

    //find element by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')


})

test('user facing locators', async ({page}) => {
    //getByRole() - ищет элемент по его доступности, а не селекторам
    //такой подход ближе к тому, как пользователь взаимодействует с приложением, и делает тесты более устойчивыми к изменениям в структуре DOM
    // и менее зависит от верстки
    await page.getByRole('textbox', {name: 'Email'}).first().click()
    await page.getByRole('button', {name: 'Sign in'}).first().click()

    //ищет элемент по его лейблу, который связан с ним через атрибут for или обертывает его
    await page.getByLabel('Email').first().click() 

    await page.getByPlaceholder('Jane Doe').click() //ищет элемент по его плейсхолдеру

    await page.getByText('Using the Grid').click() //ищет элемент по его тексту, который виден пользователю

    await page.getByTestId('SignIn').click() //ищет элемент по его атрибуту data-testid

    await page.getByTitle('IoT Dashboard').click() //ищет элемент по его атрибуту title
})

test('locating child elements', async ({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    //nth - это индекс, starts with 0. 
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('locating parent elements', async ({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic Form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()
 
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    //NOT recommended
    //1 lvl up
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('reusing locators', async ({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    const passwordField = basicForm.getByRole('textbox', {name: "Password"})
    const checkbox = basicForm.locator('nb-checkbox')
    const button = basicForm.getByRole('button')

    let email = process.env.USERNAME
    let password = process.env.PASSWORD
    
    await emailField.fill(email)
    await passwordField.fill(password)
    await checkbox.click()
    await button.click()

    await expect(emailField).toHaveValue(email)
    await expect(passwordField).toHaveValue(password)
    await expect(checkbox).toBeChecked
})

test('extracting values', async({page}) => {
    //single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic Form"})
    const buttonText = await basicForm.locator('button').textContent()
    let exp = "Submit"

    expect(buttonText).toEqual(exp)

    //all text values of radiobuttons
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    let label = "Option 1"

    expect(allRadioButtonsLabels).toContain(label)

    //how to find input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    let email = "test@test.com"

    await emailField.fill(email)
    const emailValue = await emailField.inputValue()

    expect(emailValue).toEqual(email)

    //get value of attribute
    let placeholder = "Email"
    const emailPlaceholder = await emailField.getAttribute('placeholder')

    expect(emailPlaceholder).toEqual(placeholder)
})

test('assertion', async({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic Form"}).locator('button')

    //general assirtion
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //Locator assertion
    await expect(basicFormButton).toHaveText("Submit")

    //sof assertion - test continues the execution even when it was failed
    await expect.soft(basicFormButton).toHaveText("SubmitZZ")
    console.log("TEST IS CONTINUED!")
})