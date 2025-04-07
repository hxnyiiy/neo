function Prime(num) {
    if (num < 2) return false;
    for (let i =2; i < num / 2; i++){
        if (num % i == 0) return false;
    }
    return true;
}

self.onmessage = function(e){
    //work task로부터 전달받은 숫자
    let input = e.data.input;

    output = number
    output += (Prime(number)) ? "is PrimeNumber" : "is not PrimeNumber";
    // 소수 판결 결과 전송
    self.postMessage(output);
};

