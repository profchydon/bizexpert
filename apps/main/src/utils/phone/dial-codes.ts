const table = `
  ad +376    ae +971    af +93     ag +1-268  ai +1-264  al +355    am +374
  ao +244    ar +54     as +1-684  at +43     au +61     aw +297    ax +358
  az +994    ba +387    bb +1-246  bd +880    be +32     bf +226    bg +359
  bh +973    bi +257    bj +229    bl +590    bm +1-441  bn +673    bo +591
  bq +599    br +55     bs +1-242  bt +975    bw +267    by +375    bz +501
  ca +1      cc +61     cd +243    cf +236    cg +242    ch +41     ci +225
  ck +682    cl +56     cm +237    cn +86     co +57     cr +506    cu +53
  cv +238    cw +599    cx +61     cy +357    cz +420    de +49     dj +253
  dk +45     dm +1-767  do +1-809  dz +213    ec +593    ee +372    eg +20
  eh +212    er +291    es +34     et +251    fi +358    fj +679    fk +500
  fm +691    fo +298    fr +33     ga +241    gb +44     gd +1-473  ge +995
  gg +44     gh +233    gi +350    gl +299    gm +220    gn +224    gq +240
  gr +30     gt +502    gu +1-671  gw +245    gy +592    hk +852    hn +504
  hr +385    ht +509    hu +36     id +62     ie +353    il +972    im +44
  in +91     io +246    iq +964    ir +98     is +354    it +39     je +44
  jm +1-876  jo +962    jp +81     ke +254    kg +996    kh +855    ki +686
  km +269    kn +1-869  kp +850    kr +82     kw +965    ky +1-345  kz +7
  la +856    lb +961    lc +1-758  li +423    lk +94     lr +231    ls +266
  lt +370    lu +352    lv +371    ly +218    ma +212    mc +377    md +373
  me +382    mg +261    mh +692    mk +389    ml +223    mm +95     mn +976
  mo +853    mp +1-670  mq +596    mr +222    ms +1-664  mt +356    mu +230
  mv +960    mw +265    mx +52     my +60     mz +258    na +264    ne +227
  nf +672    ng +234    ni +505    nl +31     no +47     np +977    nr +674
  nu +683    nz +64     om +968    pa +507    pe +51     pf +689    pg +675
  ph +63     pk +92     pl +48     pn +64     pr +1-787  ps +970    pt +351
  pw +680    py +595    qa +974    ro +40     rs +381    ru +7      rw +250
  sa +966    sb +677    sc +248    sd +249    se +46     sg +65     si +386
  sk +421    sl +232    sm +378    sn +221    so +252    sr +597    ss +211
  st +239    sv +503    sx +1-721  sy +963    sz +268    tc +1-649  td +235
  tg +228    th +66     tj +992    tk +690    tl +670    tm +993    tn +216
  to +676    tr +90     tt +1-868  tv +688    tw +886    tz +255    ua +380
  ug +256    us +1      uy +598    uz +998    va +379    vc +1-784  ve +58
  vg +1-284  vi +1-340  vn +84     vu +678    ws +685    xk +383    ye +967
  za +27     zm +260    zw +263
`;

const tokens = table.trim().split(/\s+/);
const entries: Array<[string, string]> = [];
for (let i = 0; i < tokens.length; i += 2)
  entries.push([tokens[i], tokens[i + 1]]);

export const dialCodes: Record<string, string> = Object.fromEntries(entries);
