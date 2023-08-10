import axios from 'axios';

// 只支持一层简单json格式的对象
const jsonToUrlEncode = (data: any) =>
    Object.entries(data)
        .filter((item: Array<string | number | any>) => item[1] !== undefined)
        .map(
            (res: Array<string | number | any>) =>
                `${res[0]}=${window.encodeURIComponent(res[1])}`,
        )
        .join('&');

const getTrueData = (data: any) =>
    data !== null && data !== '' && data !== undefined;
const getParams = (method: any, data: any) => {
    switch (method) {
        case 'get':
            return jsonToUrlEncode(data);
    }
};

export default async function request(params: any) {
    const { url, data, method = 'get', ...last } = params;
    const new_data: any = {};
    for (let key in data) {
        if (getTrueData(data[key])) new_data[key] = data[key];
    }

    try {
        const res: any = await axios(
            (method === 'get') && data
                ? `${url}?${getParams(method, new_data)}`
                : url,
            {
                data,
                method,
                ...last,
                headers: { 'Content-Type': 'application/json' },
            },
        );

        if (res.status === 200) {
            return res.data;
        } else {
            throw new Error(res?.error || 'Error');
        }
    } catch (e) {
        const err = e.response ? e.response.data : e;
        const msg = err?.message || e.message || err;

        // message.error(msg);
        return Promise.reject(msg);
    }
}
