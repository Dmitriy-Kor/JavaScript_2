/**
 * описываем класс
 */
class Form {
    constructor(form) {
        this.form = form; // получаем форму
        this.inputs = this.form.querySelectorAll('.form__input')
        //паттерны
        this.regExp = {
            name:/[A-Za-zА-Яа-яЁё]/,
            phone:/\+\d\(\d{3}\)\d{3}-\d{4}/,
            email:/[a-z-\.]+@[a-z]+\.ru/i
        };
        // сообщение при ошибке валидации
        this.errors = {
            name: 'Имя должно содержать только буквы.',
            phone: 'Телефон должен имееть вид: +7(000)000-0000.',
            email: 'E-mail должен имееть вид: mymail@mail.ru<br>my.mail@mail.ru<br>my-mail@mail.ru'
        };
        // сообщение при ок валидации
        this.messege = {
            name: 'Кредит оформлен.',
            phone: 'Деньги списаны со счета.',
            email: 'Спам отправлен.'
        };
        this.init();
    }

    /**
     * метод добавляет оброботчик события на форму
     */
    init(){
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();
            this.validate();
            this.validateTextarea();
        });
    }

    /**
     * метод вызывае валидацию input-ов
     */
    validate(){
        this.inputs.forEach(  (input) => {
            this.check(input);
        } )
    }

    /**
     * метод сравнивает данные из объекта (input) с патерном(regExp)
     * @param input
     */
    check(input){
        let reg = this.regExp[input.name];

        if (reg.test(input.value)) {
            input.classList.remove('red');
            input.classList.add('green');
            this.writeMassage(input);
        } else {
            input.classList.remove('green');
            input.classList.add('red');
            this.writeError(input);
        }
    }

    /**
     * Метод выводит сообщение об ошибке
     * @param input
     */
    writeError(input){
        let errorText = this.errors[input.name];
        let block = document.querySelector(`p[data-name="${input.name}"]`)
        block.innerHTML = errorText;
        this.addAndRemoveClass(block,'ok-text','error-text')
    }

    /**
     * Метод выводит сообщение при правельной валидации
     * @param input
     */
    writeMassage(input){
        let message = this.messege[input.name];
        let block = document.querySelector(`p[data-name="${input.name}"]`)
        block.innerHTML = message;
        this.addAndRemoveClass(block,'error-text','ok-text')
    }

    /**
     * метод валидирует textarea (произвольный текст), и выводит сообщение
     */
    validateTextarea(){
        let area = this.form.querySelector('.form__text');
        let block = this.form.querySelector('p[data-name="text"]');
        // проверяет пустая форма и отличается сообщение от начального
        if (area.value.length >0 && area.value !== 'Ваше сообщение'){
            this.addAndRemoveClass(area,'red','green')
            block.innerHTML = 'Компромат собран.';
            this.addAndRemoveClass(block,'error-text','ok-text')
        } else {
            this.addAndRemoveClass(area,'green','red')
            block.innerHTML = 'Напишите произвольный текст сообщения.';
            this.addAndRemoveClass(block,'oc-text','error-text')
        }
    }

    /**
     * Метод удаляет и добавляет классы в элементе html
     * @param element - элемент html
     * @param removeClass - удаляемый класс css ('red')
     * @param addCass - добавляемый класс css ('green')
     */
    addAndRemoveClass(element,removeClass,addCass){
        element.classList.remove(removeClass);
        element.classList.add(addCass);
    }

}
