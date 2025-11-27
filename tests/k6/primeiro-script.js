import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
    vus: 10,
    // duration: '30s',
    iterations: 1,
    thresholds: {
        http_req_duration: ['p(90)<=2', 'p(95)<=3'],
        http_req_failed: ['rate<0.01']
    }
};

export default function () {
    let responseLoginInstructor = '';

    group('Realizando login com o instrutor', () => {
        responseLoginInstructor = http.post(
            'http://localhost:3000/instructors/login',
            JSON.stringify({
                email: "fer@nanda.com",
                password: "123456"
            }),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    })

    group('Registrando uma nova lição', () => {
        let responseLesson = http.post(
            'http://localhost:3000/lessons',
            JSON.stringify({
                title: "Como montar a flauta transversal",
                description: "Montando as três partes da flauta transversal e alinhando as peças"
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${responseLoginInstructor.json('token')}`
                }
            });

        check(responseLesson, {
            "status deve ser igual a 201": (responseLesson) => responseLesson.status === 201
        })
    });

    group('Listando as lições', () => {
        let responseListarLicoes = http.get(
            'http://localhost:3000/lessons',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${responseLoginInstructor.json('token')}`
                }
            });

        check(responseListarLicoes, {
            "status deve ser igual a 200": (responseListarLicoes) => responseListarLicoes.status === 200
        })

    });

    // console.log(res.json('token'))

    group('Simulando o pensamento do usuário', function () {
        sleep(1); // User Think Time
    })
}