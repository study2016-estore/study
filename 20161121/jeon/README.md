#Git, Github
####Git
- 버전 관리
- 리눅스 토발즈
- `commit`은 로컬 저장소에서 이루어 지는게 특징

![관계도]("/git-transport.png")

####Github
- Git 버전 컨트롤 시스템에 기반한 오픈소스 프로젝트를 위한 소셜 저장소

#Git명령어
####환경설정
```
git config --global user.name "사용자명" 
git config --global user.email "이메일주소"
git config --global --list
```

####기본
```
// stage 영역에 올리기
git add 파일명
// local 리퍼지토리 반영
git commit -m "커밋메시지"
// 브랜치 변경
git branch
// 해당 브랜치로 작업트리 변경
git checkout 
```